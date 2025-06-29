import CategoryModel from "../models/categorymodel.js";
import ProductModel from "../models/productmodel.js";
import SubCategoryModel from "../models/subcategory.js";


export const AddCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name, !image) {
            return res.status(400).json({
                message: "Please fill in all fields",
                error: true,
                success: false
            });
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const result = await addCategory.save();

        if (!result) {
            return res.status(400).json({
                message: "Failed to add category",
                error: true,
                success: false
            })
        }

        return res.status(201).json({
            message: "Category Added Successfully",
            error: false,
            success: true,
            result
        })



    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
}


export const getCategoryCntroller = async (req, res) => {
    try {
        const category = await CategoryModel.find();

        res.json({
            message: "Category Retrieved Successfully",
            error: false,
            success: true,
            data: category
        })


    } catch (error) {
        res.json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const editCategory = async (req, res) => {

    try {
        const { _id, name, image } = req.body;
        if (!_id || !name || !image) {
            res.json({
                message: "the credentials are missing",
                error: true,
                success: false
            })
        }

        const update = await CategoryModel.findByIdAndUpdate({
            _id: _id
        },
            { name, image }
        )

        res.json({
            message: "updated successfully",
            error: false,
            success: true,
            data: update
        })

    } catch (error) {
        res.json({
            message: error.message,
            error: true,
            success: false
        })
    }
}


export const deleteCategory = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            return res.json({
                message: "id is missing",
                success: false,
                error: true
            });
        }

        const checkInSubCat = await SubCategoryModel.find({
            category: { "$in": [_id] }
        }).countDocuments();

        const checkInProd = await ProductModel.find({
            category: { "$in": [_id] }
        }).countDocuments();

        if (checkInSubCat > 0 || checkInProd > 0) {
            return res.json({
                message: "This Category is used in a Subcategory or Product",
                success: false,
                error: true
            });
        }

        await CategoryModel.findByIdAndDelete(_id);

        res.json({
            message: "Category deleted successfully",
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.json({
            message: "Error deleting category",
            success: false,
            error: true
        });
    }
};




export const addSubCategory = async (req, res) => {

    try {
        const { name, image, category } = req.body;

        if (!name || !image || !category[0]) {
            res.json({
                message: "Please fill all fields",
                success: false,
                error: true
            })
        }

        const SubCategory = new SubCategoryModel({
            name,
            image,
            category
        })

        const result = await SubCategory.save();

        res.json({
            message: "SubCategory added Successfully",
            success: true,
            error: false,
            data: result
        })

    } catch (error) {
        res.json({
            message: "Error adding SubCategory",
            success: false,
            error: true
        })
    }
}


export const getSubCategories = async (req, res) => {
    try {
        // Default limit of 10, max limit of 100 to prevent abuse
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100); 
        const skip = (page - 1) * limit;
        
        const data = await SubCategoryModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("category");
            
        const total = await SubCategoryModel.countDocuments();
        
        res.json({
            message: "SubCategories retrieved successfully",
            data: {
                subCategories: data,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error fetching subcategories",
            error: true
        });
    }
};


export const getAllSubCategories = async (req, res) => {
    try {
        const data = await SubCategoryModel.find().populate("category");

        res.json({
            message: "SubCategories retrieved successfully",
            error: false,
            success: true,
            data
        })

    } catch (error) {
        res.json({
            message: error.message,
            error: true,
            success: false
        })
    }
}


export const editSubCategory = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body;
        if (!_id || !name || !image || !category[0]) {
            res.json({
                message: "the credentials are missing",
                error: true,
                success: false
            })
        }

        const update = await SubCategoryModel.findByIdAndUpdate({
            _id: _id
        },
            { name, image, category }
        )

        res.json({
            message: "updated successfully",
            error: false,
            success: true,
            data: update
        })

    } catch (error) {
        res.json({
            message: error.message,
            error: true,
            success: false
        })
    }
}



export const deleteSubCategory = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            res.json({
                message: "id is missing",
                success: false,
                error: true
            })
        }

        const result = await SubCategoryModel.findByIdAndDelete({ _id });

        res.json({
            message: "SubCategory deleted Successfully",
            success: true,
            error: false
        })
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
            error: true
        })
    }
}