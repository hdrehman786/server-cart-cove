import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: [{
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
}],
    paymentMethod : {
        type: String,
        default : null
    },
    paymentId : {
        type: String,
        default: null
    },
    paymentStatus : {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    delivery_address : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
    },
    delivery_status : {
        type: String,
        enum: ['pending', 'success', 'failed'],
    },
    subTotal: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    invoice: {
        type: String,
        default: null
    },
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;