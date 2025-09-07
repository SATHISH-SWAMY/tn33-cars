import express from "express";
import {
  createRazorpayOrder,                  // Razorpay
  saveRazorpayTransaction,  // Razorpay
  createPhonePeOrder,           // PhonePe
  verifyPhonePePayment          // PhonePe
} from "../controllers/paymentController.js";

const router = express.Router();

// ===== Razorpay =====
router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify-payment", saveRazorpayTransaction);

// ===== PhonePe =====
router.post("/phonepe/create-order", createPhonePeOrder);
router.post("/phonepe/verify-payment", verifyPhonePePayment);

export default router;




// import express from "express";
// import {
//   createOrder,
//   saveTransactionAfterPayment
// } from "../controllers/paymentController.js";

// const router = express.Router();

// router.post("/create-order", createOrder);
// router.post("/verify-payment", saveTransactionAfterPayment);

// export default router;
