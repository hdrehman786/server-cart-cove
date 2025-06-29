
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    }, 
}, {timestamps: true});
const CategoryModel = mongoose.model("category", categorySchema);

export default CategoryModel;