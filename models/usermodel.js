import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide Name"],
  },
  email: {
    type: String,
    required: [true, "Provide Email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Provide Password"],
  },
  avatar:{
    type: String,
    default: "default.jpg"
  },
  mobile: {
    type: String,
    default: ""
  },
  refresh_token: {
    type: String,
    default: null
  },
  verify_email:{
    type: Boolean,
    default: false
  },
  last_login_date : {
    type: Date,
    default: Date.now
  },
  status : {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active"
  },
  address_details : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address"
    }
  ],
  shopping_cart : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cartProduct"
    }
  ],
  orderHistory : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }
  ],
  forget_password_otp: {
    type: String,
    default: null
  },
  forget_password_expire: {
    type: Date,
    default: null
  },
  role:{
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER"
  },
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;