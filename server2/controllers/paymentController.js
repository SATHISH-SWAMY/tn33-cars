import Razorpay from "razorpay";
import Transaction from "../models/Transaction.js";
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';
import { randomUUID } from 'crypto';

// ================= Razorpay Setup =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ================= PhonePe Setup =================
const phonePeClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPE_MERCHANT_ID,
  process.env.PHONEPE_SALT_KEY,
  1,
  process.env.PHONEPE_ENV === 'PROD' ? Env.PRODUCTION : Env.SANDBOX
);

// ================= Razorpay Create Order =================
const createRazorpayOrder = async (req, res) => {
  const { amount ,formData } = req.body;

  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const transaction = new Transaction({
      payment_provider: "razorpay",
      razorpay_order_id: order.id,
      amount: order.amount,
      status: "created",
      formData
    });

    await transaction.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// ================= Razorpay Save Transaction =================
const saveRazorpayTransaction = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "paid"
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Payment recorded successfully", transaction });
  } catch (error) {
    console.error("Save Razorpay payment error:", error);
    res.status(500).json({ message: "Failed to save payment" });
  }
};

// ================= PhonePe Create Order =================
const createPhonePeOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const merchantOrderId = randomUUID();

    const payRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount) // in paisa
      .redirectUrl(`${process.env.FRONTEND_URL}/payment-status`)
      .build();

    const response = await phonePeClient.pay(payRequest);

    // Save transaction for tracking
    const transaction = new Transaction({
      payment_provider: "phonepe",
      phonepe_order_id: merchantOrderId,
      amount,
      status: "created"
    });
    await transaction.save();

    res.json({
      checkoutUrl: response.redirectUrl,
      merchantOrderId
    });
  } catch (error) {
    console.error("PhonePe create order error:", error);
    res.status(500).json({ message: "Failed to create PhonePe order" });
  }
};

// ================= PhonePe Verify Payment =================
const verifyPhonePePayment = async (req, res) => {
  try {
    const { merchantOrderId } = req.body;
    const statusResponse = await phonePeClient.getOrderStatus(merchantOrderId);

    if (statusResponse.success && statusResponse.data.state === "COMPLETED") {
      await Transaction.findOneAndUpdate(
        { phonepe_order_id: merchantOrderId },
        { status: "paid" }
      );
    }

    res.json(statusResponse);
  } catch (error) {
    console.error("PhonePe verify error:", error);
    res.status(500).json({ message: "Failed to verify PhonePe payment" });
  }
};

export {
  createRazorpayOrder,
  saveRazorpayTransaction,
  createPhonePeOrder,
  verifyPhonePePayment
};


























// import Razorpay from "razorpay";
// import Transaction from "../models/Transaction.js"; // Add .js extension
// import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';
// import { randomUUID } from 'crypto';


// // ================= Razorpay Setup =================
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // ================= PhonePe Setup =================
// const phonePeClient = StandardCheckoutClient.getInstance(
//   process.env.PHONEPE_MERCHANT_ID,
//   process.env.PHONEPE_SALT_KEY,
//   1,
//   process.env.PHONEPE_ENV === 'PROD' ? Env.PRODUCTION : Env.SANDBOX
// );

// // 1. Create Razorpay Order & Save to DB
// const createOrder = async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const options = {
//       amount,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`
//     };

//     const order = await razorpay.orders.create(options);

//     const transaction = new Transaction({
//       razorpay_order_id: order.id,
//       amount: order.amount,
//       status: "created"
//     });

//     await transaction.save();

//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({ message: "Failed to create Razorpay order" });
//   }
// };

// // 2. Save Payment Info after successful payment
// const saveTransactionAfterPayment = async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature
//   } = req.body;

//   try {
//     const transaction = await Transaction.findOneAndUpdate(
//       { razorpay_order_id },
//       {
//         razorpay_payment_id,
//         razorpay_signature,
//         status: "paid"
//       },
//       { new: true }
//     );

//     if (!transaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }

//     res.status(200).json({ message: "Payment recorded successfully", transaction });
//   } catch (error) {
//     console.error("Save payment error:", error);
//     res.status(500).json({ message: "Failed to save payment" });
//   }
// };

// // ✅ Use ES module export
// export { createOrder, saveTransactionAfterPayment };
