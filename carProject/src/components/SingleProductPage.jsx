import React, { useState } from 'react';
import Header from './Header';
import { Button } from "@/components/ui/button";
import { Calendar, Umbrella, Heart, Fuel, Key, FileText, Cog, User, Gauge, Settings, MapPin, Phone, Shield, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from "sweetalert2";
import axios from 'axios';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
function SingleProductPage() {
  const location = useLocation();
  const car = location.state?.car;
  console.log(car);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!car) return <h2 className="text-center text-2xl mt-10">No Car Data Provided</h2>;

  const allImages = Object.values(car.images);
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImage1, setActiveImage1] = useState(allImages[0]);
  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [isOpen, setIsOpen] = useState();
  const [modeOpen, setIsModeOpen] = useState('');
  const [name, setName] = useState('');
  console.log('name', name);

  const [contact, setContact] = useState('');
  const [locat, setLocat] = useState('');


  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setActiveImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setActiveImage(allImages[prevIndex]);
  };
  const nextImage1 = () => {
    const nextIndex = (currentImageIndex1 + 1) % allImages.length;
    setCurrentImageIndex1(nextIndex);
    setActiveImage1(allImages[nextIndex]);
  };

  const prevImage1 = () => {
    const prevIndex = currentImageIndex1 === 0 ? allImages.length - 1 : currentImageIndex1 - 1;
    setCurrentImageIndex1(prevIndex);
    setActiveImage1(allImages[prevIndex]);
  };

  // Book Test Drive Handler
const handleTestDriverSubmit = async () => {
  try {
    // Check if user is logged in (example using localStorage or your auth state)
    const token = localStorage.getItem("authToken"); // or from context / redux
    if (!token) {
      alert("You need to be logged in to proceed!");
      return;
    }

    console.log("Form Submitted:", name, contact, locat, car._id);
    const paymentMode = modeOpen === 'bookTestDrive' ? 'Booked Test Drive' : 'Get More Detail';
    const testDriveData = {
      name,
      contact,
      locat,
      carID: car._id,
      paymentMode,
    };

    // ---------- Razorpay flow ----------
    const orderRes = await axios.post(
      `${import.meta.env.VITE_API_URL}/payments/razorpay/create-order`,
      { amount: 50000, formData: testDriveData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token to verify on backend
        },
        withCredentials: true
      }
    );

    const orderData = orderRes.data;
    if (!orderData.id) throw new Error("Failed to create Razorpay order");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "TN33 Cars",
      description: `${paymentMode} Payment`,
      order_id: orderData.id,
      handler: async (response) => {
        console.log("Payment Success:", response);
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/payments/razorpay/verify-payment`,
            response,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true
            }
          );
        } catch (error) {
          console.error(error.response?.data.message || "Failed to verify payment");
        }
      },
      prefill: { name: name || "", contact: contact || "" },
      theme: { color: "#3399cc" },
      method: { upi: true },
      modal: { escape: false, backdropclose: false, handleback: false }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("❌ Error:", error);
    alert(`Payment or submission failed: ${error.message}`);
  }
};



  return (
    <>
      <Header />
      <div className="bg-[#e04c4c]  from-gray-50 to-gray-100 min-h-screen">

        <div className="bg-[#e04c4c]  max-w-7xl mx-auto p-6 lg:p-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">

            {/* Left: Enhanced Image Section */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 w-full">
                {/* Main Image Container */}
                <div className="relative mb-6 group">
                  <img
                    src={activeImage}
                    alt="Main Display"
                    className="w-full h-[400px] lg:h-[500px] xl:h-[600px] object-cover rounded-2xl shadow-lg"
                  />

                  {/* Image Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {allImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => {
                        setActiveImage(img);
                        setCurrentImageIndex(index);
                      }}
                      className={`w-20 h-20 lg:w-24 lg:h-24 object-cover cursor-pointer rounded-xl border-3 hover:scale-105 transition-all duration-200 flex-shrink-0 ${img === activeImage
                        ? 'border-orange-500 shadow-lg ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Additional Car Info Cards */}
              <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-1 gap-6 mt-8">
                {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Key Features</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      4WD Capability
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Manual Transmission
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Low Mileage
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Well Maintained
                    </li>
                  </ul>
                </div> */}

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Inspection Report</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span className="font-semibold text-green-600">Excellent Condition</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Professionally inspected with 200+ quality checks. All major components verified.
                  </p>
                </div>
              </div>
              {/* Additional Car Info Cards */}
              <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-1 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Car overview</h2>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Content Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Row 1 */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Reg. year</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">Aug 2018</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Fuel className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Fuel</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">Petrol</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Gauge className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">KM driven</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">70,953 km</span>
                      </div>

                      {/* Row 2 */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Transmission</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">Automatic</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Cog className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Engine capacity</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">1591cc</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Ownership</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">1st</span>
                      </div>

                      {/* Row 3 */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Make year</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">Jul 2018</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Spare key</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">No</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Reg number</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">DL8C**0690</span>
                      </div>

                      {/* Row 4 */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Umbrella className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 flex items-center">
                            Insurance
                            <svg className="w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <span className="text-base font-medium text-orange-600">Need renewal</span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Insurance type</span>
                        </div>
                        <div className="text-base font-medium text-gray-900">
                          <div>Plans from</div>
                          <div className="text-blue-600">₹8,277/y</div>
                        </div>
                      </div>

                      {/* Empty cell for alignment */}
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Info Section */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Header Section */}
                  <div className="p-6">
                    {/* Title and Heart */}
                    <div className="flex justify-between items-start mb-4">
                      <h1 className="text-xl font-bold text-gray-900 leading-tight pr-4">
                        {car.name}
                      </h1>
                      <div className="bg-gray-50 p-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer">
                        <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" />
                      </div>
                    </div>

                    {/* Car Details Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { label: `${car.KMdriven} km`, color: 'bg-blue-100 text-blue-800' },
                        { label: `${car.Ownership}st owner`, color: 'bg-purple-100 text-purple-800' },
                        { label: car.Transmission, color: 'bg-green-100 text-green-800' },
                        { label: car.fuel, color: 'bg-orange-100 text-orange-800' },
                        { label: car.Regnumber, color: 'bg-gray-100 text-gray-800' }
                      ].map((tag, index) => (
                        <span key={index} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${tag.color}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-700 font-medium">{car.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 cursor-pointer hover:text-orange-600 transition-colors">
                        {/* <Phone className="w-4 h-4" /> */}
                        {/* <span className="text-sm font-semibold">Call us</span> */}
                      </div>
                    </div>

                    {/* CARS24 Assured */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl mb-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">TN33CARS Assured</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </div>

                    {/* EMI and Price Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
                      {/* <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2 font-medium">EMI starts at</p>
                          <p className="text-2xl font-bold text-gray-900">₹{car.emiPrice}<span className="text-lg font-normal text-gray-600">/mo</span></p>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-2 rounded-lg transition-colors">
                          Check eligibility
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div> */}

                      <div className="border-t border-gray-200 pt-4 flex justify-center items-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">₹{car.price} <span className="text-lg font-normal text-gray-600">lakh</span></p>
                          <p className="text-xs text-gray-500">+₹{car.otherCharges} other charges</p>
                        </div>
                        {/* <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                          Price breakup
                          <ArrowRight className="w-4 h-4" />
                        </button> */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 relative">
                      {car.soldOut ? (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md">
                          SOLD OUT
                        </div>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setIsOpen(true);
                              setIsModeOpen("bookTestDrive");
                            }}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
          hover:from-orange-600 hover:to-orange-700 text-white 
          font-bold py-4 px-6 rounded-2xl transition-all 
          duration-200 transform hover:scale-[1.02] shadow-lg"
                          >
                            Book Test Drive
                          </Button>

                          <Button
                            onClick={() => {
                              setIsOpen(true);
                              setIsModeOpen("getMoreDetails");
                            }}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
          hover:from-orange-600 hover:to-orange-700 text-white 
          font-bold py-4 px-6 rounded-2xl transition-all 
          duration-200 transform hover:scale-[1.02] shadow-lg"
                          >
                            Get more details
                          </Button>
                        </>
                      )}
                    </div>


                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Quick response</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Best price</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      {/* Popup Modal */}
      {
        isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-[90%] max-w-5xl h-[90%] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {modeOpen == 'bookTestDrive' ? 'Book Your Test Drive' : 'Get More Detail'}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section - Image Gallery */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full">
                  {/* Main Image */}
                  <div className="relative mb-6 group">
                    <img
                      src={activeImage1}
                      alt="Car Display"
                      className="w-full h-[350px] lg:h-[450px] object-cover rounded-2xl shadow-lg"
                    />

                    {/* Navigation */}
                    <button
                      onClick={prevImage1}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage1}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex1 + 1} / {allImages.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {allImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => {
                          setActiveImage1(img);
                          setCurrentImageIndex1(index);
                        }}
                        className={`w-20 h-20 lg:w-24 lg:h-24 object-cover cursor-pointer rounded-xl border-3 hover:scale-105 transition-all duration-200 flex-shrink-0 ${img === activeImage1
                          ? 'border-orange-500 shadow-lg ring-2 ring-orange-200'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Section - Form */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      name="contact"
                      placeholder="Enter contact number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter your location"
                      value={locat}
                      onChange={(e) => setLocat(e.target.value)}
                      required
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Info Box */}
                    <div className="bg-blue-50 p-4 border-l-4 border-blue-500 text-blue-800 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        A <strong className="text-blue-700">₹500 consultation fee</strong> will be charged.
                        Once booked, our team will bring the car to your location within
                        <strong> 2–3 days</strong> for a hassle-free test drive experience at your doorstep.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTestDriverSubmit}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {modeOpen == 'bookTestDrive' ? ' Confirm Test Drive' : 'Get More Detail'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }



    </>
  );
}

export default SingleProductPage;
