import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

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
  console.log("Form data:", data);

  const token = localStorage.getItem("authToken");

    if (!token) {
    alert("You must be logged in to proceed with payment.");
    // Optionally open login dialog here
    return;
  }

  try {
    // 1. Create order on backend
    const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/payments/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 50000 }) // amount in paisa
    });

    const orderData = await orderRes.json();

    if (!orderData.id) throw new Error("Failed to create Razorpay order");

    // 2. Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your real key
      amount: orderData.amount,
      currency: "INR",
      name: "Your Company Name",
      description: "SaleForm Payment",
      order_id: orderData.id,
      handler: async (response) => {
        console.log("✅ Payment Success:", response);

        // 3. Send payment info to backend to save transaction
        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/payments/razorpay/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });

        if (!verifyRes.ok) {
          throw new Error("Failed to verify payment on backend");
        }

        // 4. Now send form data (images + text)
        const formData = new FormData();

        for (let key in data) {
          if (key === "images") {
            for (let i = 0; i < data.images.length; i++) {
              formData.append("images", data.images[i]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }

        // Add Razorpay payment ID to the form
        formData.append("payment_id", response.razorpay_payment_id);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/saleForm/oldcars`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to add SaleForm");
        }

        const result = await res.json();
        console.log("✅ SaleForm Saved:", result);
        alert("SaleForm submitted successfully!");
        reset();
        setPreviews([]);

      },
      prefill: {
        name: data.name || "",
        contact: data.contact || "",
      },
      theme: {
        color: "#3399cc"
      },

       method: {
    upi: true // ✅ enable UPI (scanner & apps)
  },
   modal: {
    escape: false,
    backdropclose: false,
    handleback: false
  }
    };



    // 5. Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();

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
        <h2 className="text-2xl font-bold text-white uppercase">Want to Sell Your Old Car?</h2>
        <p className="text-white mt-2">Help us understand your car to give you the best resale options</p>
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
