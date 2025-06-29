import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    images: [
        {
        type:String
        }
    ],
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
        },
    ],
    subCategory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
        }
    ],
    price: {
        type: Number,
        default:null
    },
    unit : {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
}, {timestamps: true});

productSchema.index({ name: "text", description: "text" });
const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;