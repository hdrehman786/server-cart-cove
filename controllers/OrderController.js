import OrderModel from "../models/ordermodel.js";
import UserModel from "../models/usermodel.js";
import CartModel from "../models/cartmodel.js";

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