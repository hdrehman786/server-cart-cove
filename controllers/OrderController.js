import OrderModel from "../models/ordermodel.js";
import UserModel from "../models/usermodel.js";
import CartModel from "../models/cartmodel.js";
import Stripe from "stripe";

export const placeOrderCOD = async (req, res) => {
  try {
    const {
      userId,
      productId, // array of product ObjectIds
      delivery_address,
      paymentMethod,
      subTotal,
      total
    } = req.body;

    if (!userId || !productId || !total || !delivery_address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for Cash on Delivery order.'
      });
    }

    // 1. Create the order
    const newOrder = await OrderModel.create({
      userId,
      productId,
      delivery_address,
      subTotal,
      total,
      paymentMethod,
      delivery_status: 'pending', 
      paymentStatus: 'pending',
      paymentId: "COD",
      invoice: "COD"
    });

    // 2. Push order ID to user's order history
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: newOrder._id } },
      { new: true }
    );

    // 3. Remove ordered products from user's shopping_cart array
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { shopping_cart: { $in: productId } } }
    );

    // 4. Delete matching cart items from CartModel
    await CartModel.deleteMany({
      userId: userId,
      productId: { $in: productId }
    });

    res.status(201).json({
      success: true,
      message: 'Cash on Delivery order placed, history updated, and cart cleaned.',
      order: newOrder
    });

  } catch (error) {
    console.error('COD Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place Cash on Delivery order.',
      error: error.message
    });
  }
};



export const getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.'
      });
    }

    const user = await OrderModel.find({
        userId: userId
    }).populate("productId").populate("delivery_address");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get Order History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order history.',
      error: error.message
    });
  }
};



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PKR_RATE = 278;

export const placeOrderByOnlinePayment = async (req, res) => {
  try {
    const { userId, products, delivery_address } = req.body;

    if (!userId || !products?.length || !delivery_address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for online payment order.',
      });
    }

    // Calculate totals correctly (note: quantity is at cart item level, not productId level)
    const subTotalUSD = products.reduce(
      (total, item) => total + (item.productId.price * item.quantity),
      0
    );

    const discountUSD = products.reduce(
      (total, item) => total + (item.productId.price * item.quantity * (item.productId.discount || 0) / 100),
      0
    );

    const totalUSD = subTotalUSD - discountUSD;

    const subTotalPKR = subTotalUSD *PKR_RATE;
    const totalPKR = totalUSD * PKR_RATE;

    console.log('SubTotal USD:', subTotalUSD);
    console.log('Discount USD:', discountUSD);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((item) => {
        const pricePKR = (item.productId.price * (1 - (item.productId.discount || 0) / 100)) * PKR_RATE;
        return {
          price_data: {
            currency: 'pkr',
            product_data: { 
              name: item.productId.name,
              images: item.productId.images // Add product images if needed
            },
            unit_amount: Math.round(pricePKR * 100), // in paisa
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}payment-success`,
      cancel_url: `${process.env.CLIENT_URL}products/mycart`,
    });

    // Prepare order data
    const orderItems = products.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      discount: item.productId.discount || 0
    }));

    const newOrder = await OrderModel.create({
      userId,
      products: orderItems, // Store full product info including quantities
      delivery_address,
      subTotal: subTotalPKR,
      discount: discountUSD * PKR_RATE,
      total: totalPKR,
      paymentMethod: 'online',
      paymentStatus: 'pending',
      paymentId: session.id,
      invoice: 'processing...',
    });

    // Update user's cart - remove the purchased items
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: newOrder._id },
    });

    // Remove items from cart collection
    const cartItemIds = products.map(item => item._id); // These are the cart item IDs
    await CartModel.deleteMany({
      _id: { $in: cartItemIds },
      userId
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      orderId: newOrder._id // Return order ID for reference
    });
  } catch (error) {
    console.error('Stripe Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order by online payment.',
      error: error.message,
    });
  }
};
