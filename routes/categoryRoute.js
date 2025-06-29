import express from 'express';
import auth from '../midleware/auth.js';
import  { AddCategoryController, addSubCategory, deleteCategory, deleteSubCategory, editCategory, editSubCategory, getAllSubCategories, getCategoryCntroller, getSubCategories } from '../controllers/categorycontroller.js';



const categoryRouter = express.Router();

categoryRouter.post("/add-category",auth,AddCategoryController);
categoryRouter.get("/get-category",getCategoryCntroller);
categoryRouter.put("/edit-gategory",auth,editCategory);
categoryRouter.delete("/delete-category",auth,deleteCategory);
// SubCategory Start
categoryRouter.post("/add-subcategory",addSubCategory);
categoryRouter.post("/get-subcategories",getSubCategories)
categoryRouter.get("/getallsubcategories",getAllSubCategories);
categoryRouter.put("/edit-subcategory",auth,editSubCategory);
categoryRouter.delete("/delete-subcategory",auth,deleteSubCategory);


export default categoryRouter;