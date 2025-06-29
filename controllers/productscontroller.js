import CartModel from "../models/cartmodel.js";
import ProductModel from "../models/productmodel.js";
import mongoose from "mongoose";
import UserModel from "../models/usermodel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, images, category, subCategory, price, unit, stock, discount, description } = req.body;

    if (!name || !images || !category) {
      return res.status(400).json({
        message: "Name, image, and at least one category are required",
        error: true
      });
    }

    const newProduct = new ProductModel({
      name,
      images: images || [],
      category,
      subCategory: subCategory || [],
      price: price || null,
      unit: unit || "",
      stock: stock || 0,
      discount: discount || 0,
      description: description || ""
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      data: savedProduct
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error creating product",
      error: true
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const data = await ProductModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category")
      .populate("subCategory");

    const total = await ProductModel.countDocuments(query);

    res.json({
      message: "Products retrieved successfully",
      success: true,
      data: {
        products: data,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching products",
      success: false,
      error: true
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;

    console.log("product id",id+"hjhjhjh");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        error: true
      });
    }

    const product = await ProductModel.findById(id)
      .populate("category")
      .populate("subCategory");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true
      });
    }

    res.json({
      message: "Product retrieved successfully",
      success: true,
      data: product
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching product",
      success: false,
      error: true
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { _id, ...updateFields } = req.body;

    console.log("Updating product with ID:", _id);
    console.log("Update fields:", updateFields);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid product ID", error: true });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate("category")
      .populate("subCategory");

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found or not updated",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: updatedProduct,
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: error.message || "Error updating product",
      error: true,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { _id } = req.body;


    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        message: "Invalid product ID",
        error: true
      });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true
      });
    }

    res.json({
      message: "Product deleted successfully",
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Error deleting product",
      success: false,
      error: true
    });
  }
};



export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Received category ID:", id);

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
        success: false,
        error: true,
      });
    }

    const categoryviseproduct = await ProductModel.find({
      category: { $in: id }
    }).limit(10);

    if (!categoryviseproduct || categoryviseproduct.length === 0) {
      return res.status(404).json({
        message: "No products found for this category",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "Category products retrieved successfully",
      success: true,
      error: false,
      data: categoryviseproduct,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};


export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId, page = 1, limit = 10 } = req.body;

    // Input validation
    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Both categoryId and subCategoryId are required",
        success: false,
        error: true
      });
    }

    // Database query construction
    const query = {
      category: { $in: Array.isArray(categoryId) ? categoryId : [categoryId] },
      subCategory: { $in: Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId] }
    };

    const skip = (page - 1) * limit;

    // Parallel database operations
    const [products, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ProductModel.countDocuments(query)
    ]);

    return res.json({
      message: "Products retrieved successfully",
      data: products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
      success: true,
      error: false
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true
    });
  }
};




export const getproductBySearch = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.body;

    // Create query based on search term
    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};


    const skip = (page - 1) * limit;



    const [data,dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt : -1}).skip(skip).limit(limit),
      ProductModel.countDocuments(query)
    ])

    res.status(200).json({
      success: true,
      error: false,
      message: "Products fetched successfully",
      data: data,
      currentPage: page,
      totalPages: Math.ceil(dataCount / limit),
      totalResults: dataCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};



export const addToCartController = async (req, res) => {
  try {
    const { productId, quantity = 1, userId } = req.body;

    // Validate required fields
    if (!productId || !userId) {
      return res.status(400).json({
        message: !productId ? "Product ID is required" : "User ID is required",
        error: true,
        success: false,
        data: null
      });
    }

    // Validate quantity is a positive number
    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
        error: true,
        success: false,
        data: null
      });
    }

    // Check if product already exists in user's cart
    const existingCartItem = await CartModel.findOne({ productId, userId });

    let cartItem;
    let alreadyExisted = false;

    if (existingCartItem) {
      // Product exists, update quantity
      existingCartItem.quantity += Number(quantity);
      cartItem = await existingCartItem.save();
      alreadyExisted = true;
    } else {
      // Create new cart item
      cartItem = await CartModel.create({
        productId,
        userId,
        quantity: Number(quantity)
      });
    }

    // Update user's shopping cart reference
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { shopping_cart: productId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
        data: null
      });
    }

    return res.status(201).json({
      message: alreadyExisted 
        ? "Product already in cart. Quantity increased." 
        : "Product added successfully to cart.",
      error: false,
      success: true,
      data: {
        cartItem,
        user: updatedUser
      }
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      message: error.message || "Failed to add product to cart",
      error: true,
      success: false,
      data: null
    });
  }
};



export const getProductsOfCartByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("userId",userId);

    if (!userId) {
      return res.json({
        message: "User ID not found",
        error: true,
        success: false,
      });
    }

    // Find all cart items for the user
    const products = await CartModel.find({ userId }).populate("productId");

    if (!products || products.length === 0) {
      return res.json({
        message: "No products found in the cart",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Cart products retrieved successfully",
      error: false,
      success: true,
      data: products,
    });

  } catch (error) {
    return res.json({
      message: error?.message || "Failed to fetch cart products",
      error: true,
      success: false,
    });
  }
};



export const updateCartQuantityController = async (req, res) => {
    try {
        const { cartItemId, newQuantity } = req.body;

        // Validate required fields
        if (!cartItemId || newQuantity === undefined) {
            return res.status(400).json({
                message: "Cart Item ID and new quantity are required",
                error: true,
                success: false,
            });
        }

        // Ensure quantity is a positive number
        if (isNaN(newQuantity) || newQuantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
                error: true,
                success: false,
            });
        }

        // Find the cart item by its own ID and update it
        const updatedCartItem = await CartModel.findByIdAndUpdate(
            cartItemId,
            { quantity: newQuantity },
            { new: true } // This option returns the document after the update
        );

        if (!updatedCartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false,
            });
        }

        res.json({
            message: "Cart quantity updated successfully",
            error: false,
            success: true,
            data: updatedCartItem,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Failed to update cart quantity",
            error: true,
            success: false,
        });
    }
};


export const removeCartItem = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    console.log("produc",productId)
    console.log("userId",userId);

    if (!productId || !userId) {
      return res.status(400).json({
        message: !productId ? "Product ID is required" : "User ID is required",
        error: true,
        success: false,
        data: null
      });
    }

    const removedItem = await CartModel.deleteOne({
      productId: new mongoose.Types.ObjectId(productId),  // 👈 convert to ObjectId
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!removedItem) {
      return res.status(404).json({
        message: "Product not found in cart",
        error: true,
        success: false,
        data: null
      });
    }

    // Also remove from user's shopping_cart array
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { shopping_cart: productId } }
    );

    return res.status(200).json({
      message: "Product removed from cart successfully",
      error: false,
      success: true,
      data: removedItem
    });

  } catch (error) {
    console.error("Remove cart item error:", error);
    return res.status(500).json({
      message: error.message || "Failed to remove product from cart",
      error: true,
      success: false,
      data: null
    });
  }
};
