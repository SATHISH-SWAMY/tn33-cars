import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  payment_provider: { type: String, enum: ["razorpay", "phonepe"], required: true }, // Who handled the payment
  razorpay_order_id: { type: String },       // For Razorpay
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },

  phonepe_order_id: { type: String },        // For PhonePe
  phonepe_transaction_id: { type: String },

  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  formData: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);




// // const mongoose = require("mongoose");
// import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//   razorpay_order_id: { type: String, required: true },
//   razorpay_payment_id: { type: String },
//   razorpay_signature: { type: String },
//   amount: { type: Number, required: true },
//   currency: { type: String, default: "INR" },
//   status: { type: String, default: "created" }, // created | paid | failed
//   createdAt: { type: Date, default: Date.now },
// });

// export default  mongoose.model("Transaction", transactionSchema);
