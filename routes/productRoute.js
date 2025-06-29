import express from 'express';
import { addToCartController, createProduct, deleteProduct, getProductByCategory, getProductByCategoryAndSubCategory, getProductById, getproductBySearch, getProducts, getProductsOfCartByUserId, removeCartItem, updateCartQuantityController, updateProduct } from '../controllers/productscontroller.js';
import auth from '../midleware/auth.js';




const productRouter = express.Router();

productRouter.post("/add-product",createProduct);
productRouter.get("/get-products", getProducts);
productRouter.put("/update-product",updateProduct);
productRouter.delete("/delete-product",deleteProduct);
productRouter.post("/getproductbyid",getProductById);
productRouter.post("/getproductbysearch",getproductBySearch);



// cart system 

productRouter.post('/getproductsbycategory',getProductByCategory);
productRouter.post("/getproductsbycategoryandsubcategory",getProductByCategoryAndSubCategory);


productRouter.put("/addtocartproduct",addToCartController);
productRouter.get("/getproductsfromcart",getProductsOfCartByUserId)
productRouter.post('/update-cart-quantity', updateCartQuantityController);
productRouter.post("/removecartitem",removeCartItem);


export default productRouter;