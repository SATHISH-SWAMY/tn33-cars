import React, { useEffect } from 'react';
import Header from '../Header';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from "sweetalert2";

function BuyNewCar() {

  const CarBrands = [
    { id: 1, brand: "Maruti Suzuki" },
    { id: 2, brand: "Tata Motors" },
    { id: 3, brand: "Mahindra & Mahindra" },
    { id: 4, brand: "Hyundai" },
    { id: 5, brand: "Honda" },
    { id: 6, brand: "Toyota" },
    { id: 7, brand: "Kia" },
    { id: 8, brand: "Renault" },
    { id: 9, brand: "Nissan" },
    { id: 10, brand: "Volkswagen" },
    { id: 11, brand: "Skoda" },
    { id: 12, brand: "MG Motor" },
    { id: 13, brand: "Mercedes-Benz" },
    { id: 14, brand: "BMW" },
    { id: 15, brand: "Audi" },
    { id: 16, brand: "Jeep" },
    { id: 17, brand: "Jaguar Land Rover" },
    { id: 18, brand: "Lexus" },
    { id: 19, brand: "Porsche" },
    { id: 20, brand: "Mini" },
    { id: 21, brand: "Force Motors" },
    { id: 22, brand: "Ashok Leyland" },
    { id: 23, brand: "Isuzu" },
    { id: 24, brand: "Bajaj Auto" },
    { id: 25, brand: "Hindustan Motors" },
    { id: 26, brand: "Hero Electric" },
    { id: 27, brand: "Ola Electric" },
    { id: 28, brand: "Tork Motors" },
    { id: 29, brand: "BYD" },
    { id: 30, brand: "Citroën" }
  ];

  const { register, handleSubmit, reset } = useForm(
    {
      defaultValues: {
        time: new Date().toLocaleTimeString('en-GB')
      }
    }
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // const oderRes = await fetch(`${import.meta.env.VITE_API_URL}/buyNewCarForm/NewCarForm`);
  // const onSubmit = async (data) => {

  //   try {
  //     // create a oder on backend 
  //     const oderRes = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-order`,
  //       { amount: 100 }, //amount in paisa
  //       {
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       }
  //     );

  //     const orderData = await oderRes.data;
  //     console.log(orderData);


  //     if (!orderData.id) throw new Error("Failed to create Razorpay order");

  //     // Configure Razorpay options

  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: orderData.amount,
  //       currency: 'INR',
  //       name: 'TN33 Cars',
  //       description: 'SalesForm Payment',
  //       order_id: orderData.id,
  //       handler: async (response) => {
  //         console.log("Payment Success:", response);

  //         //send payment info to backend to save transation

  //         try {

  //           const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/payments/verify-payment`,
  //             { response },
  //             {
  //               headers: { "Content-Type": "application/json" }
  //             }
  //           );
  //           console.log("✅ Payment Verified:", verifyRes.data);
  //         } catch (error) {
  //           console.error(error.response?.data.message || "failed to verify-payment")
  //         }



  //         // now send the data of Buy New Car Form

  //         const formData = new FormData();

  //         formData.append("payment_id", response.razorpay_payment_id);
  //         console.log(formData);


  //         try {
  //           const res = await axios.post(`${import.meta.env.VITE_API_URL}/buyNewCarForm/NewCarForm`,
  //             formData,
  //             {
  //               headers: {}
  //             }
  //           )

  //           const result = await res.data
  //           console.log("✅ SaleForm Saved:", result);
  //           alert("SaleForm submitted successfully!");
  //           reset();
  //           setPreviews([]);
  //         } catch (error) {
  //           console.error("Error Submitting Buy New Car Form", error);
  //           alert(error.response?.data?.message || "failed to add buy new car form")
  //         }

  //       },
  //       prefill: {
  //         name: data.name || "",
  //         contact: data.contact || ""
  //       },
  //       theme: {
  //         color: "#3399cc"
  //       },

  //       method: {
  //         upi: true // ✅ enable UPI (scanner & apps)
  //       },
  //       modal: {
  //         escape: false,
  //         backdropclose: false,
  //         handleback: false
  //       }

  //     }
  //     // open Razorpay 

  //     const rzp = new window.Razorpay(options);

  //     rzp.open();

  //   } catch (error) {
  //     console.error("❌ Error:", error);
  //     alert(`Payment or submission failed: ${error.message}`);
  //   }
  // };


  const onSubmit = async (data) => {

  // const { value: method } = await Swal.fire({
  //     title: "Choose Payment Method",
  //     input: "radio",
  //     inputOptions: {
  //       razorpay: "Razorpay",
  //       phonepe: "PhonePe"
  //     },
  //     inputValidator: (value) => {
  //       if (!value) {
  //         return "You need to choose a payment method!";
  //       }
  //     },
  //     confirmButtonText: "Continue",
  //     showCancelButton: true,
  //   });

  //   if (!method) return; // user cancelled

    // ✅ set the chosen method
    const paymentMethod = 'razorpay';

  try {
    if (paymentMethod === "razorpay") {
      // ---------- Razorpay flow ----------
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/razorpay/create-order`,
        { amount: 50000 }, // amount in paisa
        { headers: { "Content-Type": "application/json" } }
      );

      const orderData = orderRes.data;
      if (!orderData.id) throw new Error("Failed to create Razorpay order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "TN33 Cars",
        description: "Buy new car Payment",
        order_id: orderData.id,
        handler: async (response) => {
          console.log("Payment Success:", response);
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/payments/razorpay/verify-payment`,
              response,
              { headers: { "Content-Type": "application/json" } }
            );
          } catch (error) {
            console.error(error.response?.data.message || "failed to verify-payment");
          }
        },
        prefill: {
          name: data.name || "",
          contact: data.contact || ""
        },
        theme: { color: "#3399cc" },
        method: { upi: true },
        modal: { escape: false, backdropclose: false, handleback: false }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } 
    // else if (paymentMethod === "phonepe") {
    //   // ---------- PhonePe flow ----------
    //   const orderRes = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/payments/phonepe/create-order`,
    //     { amount: 100 }, // amount in paisa
    //     { headers: { "Content-Type": "application/json" } }
    //   );

    //   // orderRes.data should contain something like { checkoutUrl: "..." }
    //   if (!orderRes.data.checkoutUrl) {
    //     throw new Error("Failed to create PhonePe order");
    //   }

    //   // Redirect to PhonePe checkout page
    //   window.location.href = orderRes.data.checkoutUrl;
    // }
  } catch (error) {
    console.error("❌ Error:", error);
    alert(`Payment or submission failed: ${error.message}`);
  }
};

  return (
    <div>

      <Header />
      <div className='bg-[#e04c4c] h-full'>
        <div className="text-center pt-10">
          <h2 className="text-2xl font-bold text-white uppercase">Want to Buy New Car ?</h2>
          <p className="text-white mt-2">Fill out the form below to help us understand your preferences</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="max-w-5xl mx-auto mt-8 bg-white p-8 shadow-md rounded-lg space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Your Name</label>
                <Input type="text" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Contact Number</label>
                <Input type="tel" placeholder="e.g. +91 " />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Your Budget (₹)</label>
                <Input type="number" placeholder="e.g. 8,00,000" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Preferred Brand</label>
                <select className="w-full border rounded px-3 py-2">
                  {CarBrands.map((e) => (
                    <option key={e.id} value={e.brand}>
                      {e.brand}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Preferred Car Model</label>
                <Input type="text" placeholder="e.g. Hyundai i20" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Preferred Features</label>
                <Input type="text" placeholder="e.g. Sunroof, Touchscreen, etc." />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Your Location</label>
                <Input type="text" placeholder="City or Town" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Driving Preference</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Select one</option>
                  <option>City</option>
                  <option>Highway</option>
                  <option>Both</option>
                </select>
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Kilometers Driven per Year</label>
                <Input type="number" placeholder="e.g. 15000" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Buying Timeframe</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Select time period</option>
                  <option>Immediately</option>
                  <option>1-3 Months</option>
                  <option>3-6 Months</option>
                  <option>More than 6 Months</option>
                </select>
              </div>
            </div>

            {/* Note and Submit */}
            <div className="bg-yellow-100 p-4 border-l-4 border-yellow-400 text-yellow-800 rounded">
              <p>
                <strong>Note:</strong> You will be charged <span className="font-bold">₹500</span> as a consultation fee.
                Based on your preferences, we will guide you through the best buying options.
              </p>
            </div>

            <div className="text-center mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow">
                Submit Your Request
              </button>
            </div>
          </div>
        </form>

        

      </div>
    </div>
  );
}

export default BuyNewCar;
