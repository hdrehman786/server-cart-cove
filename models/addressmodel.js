
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    address_line : {
        type: String,
    },
    city : {
        type: String,
    },
    state : {
        type: String,
    },
    pincode : {
        type: Number,
    },
    country : {
        type: String,
    },
    mobile : {
        type: String,
    },

}, {
    timestamps: true,
})

const AddressModel = mongoose.model('address', addressSchema);

export default AddressModel;