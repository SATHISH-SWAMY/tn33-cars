import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import axios, { Axios } from 'axios';

function SaleForm() {
  const { register, handleSubmit, reset , watch} = useForm(
    {
      defaultValues: {
        images: [], date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString('en-GB')
      }
    });
    const images = watch("images");
    const [previews, setPreviews] = useState([]);

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);




  // const onSubmit = async (data) => {
  //   console.log(data)
  //   try {
  //     const formData = new FormData();

  //     // Append all fields
  //     for (let key in data) {
  //       if (key === "images") {
  //         for (let i = 0; i < data.images.length; i++) {
  //           formData.append("images", data.images[i]); // send raw File
  //         }
  //       } else {
  //         formData.append(key, data[key]);
  //       }
  //     }

  //     const res = await fetch("http://localhost:8000/SaleForm", {
  //       method: "POST",
  //       body: formData, // ✅ No need to set Content-Type
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json().catch(() => ({}));
  //       throw new Error(errorData.message || "Failed to add SaleForm");
  //     }

  //     const result = await res.json();
  //     console.log("Success:", result);
  //     alert("SaleForm added successfully!");
  //     reset();
  //     setPreviews([]);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert(`Failed to add car: ${error.message}`);
  //   }
  // };

 const onSubmit = async (data) => {
   const token = localStorage.getItem("authToken"); // or from context/redux
    if (!token) {
      alert("You need to be logged in to make a payment!");
      return;
    }
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
        description: "Car valuation Payment",
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
    else if (paymentMethod === "phonepe") {
      // ---------- PhonePe flow ----------
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/phonepe/create-order`,
        { amount: 100 }, // amount in paisa
        { headers: { "Content-Type": "application/json" } }
      );

      // orderRes.data should contain something like { checkoutUrl: "..." }
      if (!orderRes.data.checkoutUrl) {
        throw new Error("Failed to create PhonePe order");
      }

      // Redirect to PhonePe checkout page
      window.location.href = orderRes.data.checkoutUrl;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    alert(`Payment or submission failed: ${error.message}`);
  }
};










  
    useEffect(() => {
      if (!images || images.length === 0) {
        setPreviews([]);
        return;
      }
  
      const urls = Array.from(images).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(urls);
  
      // Cleanup to avoid memory leaks
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [images]);

  return (
    <div>
      <Header />
    <div className='bg-[#e04c4c]'>
      <div className="text-center pt-10">
        <h2 className="text-2xl font-bold text-white uppercase">Car Valuation</h2>
        <p className="text-white mt-2">Know your car’s market value by filling out this form</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto mt-8 bg-white p-8 shadow-md rounded-lg space-y-6">
        {/* Owner Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
            <Input type="text" placeholder="Full Name" {...register("name")} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
            <Input type="tel" placeholder="e.g. +91 9876543210" {...register("contact")} />
          </div>
        </div>

        {/* Car Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Car Brand</label>
            <Input type="text" placeholder="e.g. Maruti Suzuki" {...register("brand")} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Car Model</label>
            <Input type="text" placeholder="e.g. Swift VXi" {...register("model")} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Manufacturing Year</label>
            <Input type="number" placeholder="e.g. 2018" {...register("year")} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Type</label>
            <select className="w-full border rounded px-3 py-2" {...register("fuel")}>
              <option value="">Select fuel type</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>
          </div>
        </div>

        {/* Usage Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">KMs Driven</label>
            <Input type="number" placeholder="e.g. 45,000" {...register("kms")} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <Input type="text" placeholder="e.g. Chennai, TN" {...register("location")} />
          </div>
        </div>

        {/* Ownership & Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ownership</label>
            <select className="w-full border rounded px-3 py-2" {...register("ownership")}>
              <option value="">Select ownership</option>
              <option>First</option>
              <option>Second</option>
              <option>Third or more</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
            <select className="w-full border rounded px-3 py-2" {...register("condition")}>
              <option value="">Select condition</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs Work</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price for the car</label>
            <Input type="number" placeholder="price" {...register("price")} />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block">Car Image</label>
          <input
            type="file"
            accept="image/*"
            enctype="multipart/form-data"
            multiple
            {...register("images", { required: "Select at least one image" })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

    
        {/* Show previews */}
        {previews.length > 0 && (
          <div className="flex space-x-2 mt-2 flex-wrap">
            {previews.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Preview ${i + 1}`}
                className="h-24 w-24 object-cover border"
              />
            ))}
          </div>
        )}
            {/* Note */}
        <div className="bg-yellow-100 p-4 border-l-4 border-yellow-400 text-yellow-800 rounded">
          <p>
            <strong>Note:</strong> A one-time consultation fee of <span className="font-bold">₹500</span> is applicable.
            After review, we will connect you with verified buyers or dealers as per your car’s details.
          </p>
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow">
            Submit Car Details
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default SaleForm;
