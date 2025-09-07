import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Eye, Car, List, Search, Filter } from 'lucide-react';
import axios from 'axios';

// Mock car brands data (replace with your CarsData)
const CarsData = {
  CarBrands: [
    { brand: 'Toyota' }, { brand: 'Honda' }, { brand: 'Ford' },
    { brand: 'BMW' }, { brand: 'Mercedes' }, { brand: 'Audi' },
    { brand: 'Hyundai' }, { brand: 'Nissan' }, { brand: 'Volkswagen' }
  ]
};

export default function CarAdminDashboard() {
  const [activeTab, setActiveTab] = useState('list');
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingCar, setEditingCar] = useState(null);
  console.log("cars", cars);

  const [previews, setPreviews] = useState([]);
  console.log("previews", previews);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      images: [],
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString('en-GB')
    }
  });

  const images = watch("images");

  useEffect(() => {
    if (editingCar) {
      // If editing, show stored images directly
      setPreviews(editingCar.images || []);
    }
  }, [editingCar]);

  // useEffect(() => {
  //   if (!images || images.length === 0) return;

  //   const urls = Array.from(images).map((file) => URL.createObjectURL(file));
  //   setPreviews(urls);

  //   // cleanup
  //   return () => urls.forEach((url) => URL.revokeObjectURL(url));
  // }, [images]);





  // Mock data for demonstration
  // useEffect(() => {
  //   const mockCars = [
  //     {
  //       _id: '1',
  //       name: 'Toyota',
  //       model: 'Camry',
  //       fuel: 'Petrol',
  //       KMdriven: 25000,
  //       Transmission: 5,
  //       Enginecapacity: '2.0L',
  //       Ownership: '1st Owner',
  //       Makeyear: 2020,
  //       Regnumber: 'KA01AB1234',
  //       Insurance: 'Valid till 2025',
  //       color: 'White',
  //       price: 1500000,
  //       Mode: 'Now Available Cars',
  //       location: 'Bangalore',
  //       negotiation: 'Available',
  //       bank: 'Available',
  //       service: 'Authorised Service Centre',
  //       date: '01/01/2024',
  //       time: '10:30:00'
  //     },
  //     {
  //       _id: '2',
  //       name: 'Honda',
  //       model: 'Civic',
  //       fuel: 'Diesel',
  //       KMdriven: 15000,
  //       Transmission: 6,
  //       Enginecapacity: '1.8L',
  //       Ownership: '1st Owner',
  //       Makeyear: 2021,
  //       Regnumber: 'KA02CD5678',
  //       Insurance: 'Valid till 2026',
  //       color: 'Black',
  //       price: 1800000,
  //       Mode: 'Upcoming Cars',
  //       location: 'Mumbai',
  //       negotiation: 'Not Available',
  //       bank: 'Available',
  //       service: 'Company service record',
  //       date: '02/01/2024',
  //       time: '14:30:00'
  //     }
  //   ];
  //   setCars(mockCars);
  //   setFilteredCars(mockCars);
  // }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/cars/get-cars`, { withCredentials: true }) // if session needed
      .then((res) => {
        console.log("Fetched cars:", res.data);
        setCars(res.data);
        setFilteredCars(res.data);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
      });
  }, []);

  // Filter cars based on search and status
  useEffect(() => {
    let filtered = cars;

    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.Regnumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(car => car.Mode === filterStatus);
    }

    setFilteredCars(filtered);
  }, [cars, searchTerm, filterStatus]);

  // Handle image previews
  useEffect(() => {
    if (!images || images.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = Array.from(images).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);



  const onSubmit = async (data) => {
    console.log("data", data);

    try {
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

      let url, method;

      if (editingCar) {
        url = `${import.meta.env.VITE_API_URL}/cars/update-car/${editingCar._id}`;
        method = "PUT";
      } else {
        url = `${import.meta.env.VITE_API_URL}/cars/add-car`;
        method = "POST";
      }

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) throw new Error((await res.json()).message || "Request failed");

      const result = await res.json();
      console.log("Success:", result);
      alert(editingCar ? "Car updated successfully!" : "Car added successfully!");

      reset();
      setPreviews([]);
      setEditingCar(null);
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed: ${error.message}`);
    }
  };


  const handleEdit = (car) => {
    setEditingCar(car);

    // Populate form with car data
    Object.keys(car).forEach(key => {
      if (key !== '_id' && key !== 'images') {
        setValue(key, car[key]);
      }
    });

    setActiveTab('add');
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/cars/delete-car/${carId}`, { withCredentials: true });
        setCars(cars.filter((car) => car._id !== carId));
        alert("Car deleted successfully!");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete car");
      }
    }
  };

const handleToggleSoldOut = async (car) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/cars/update-car/${car._id}`,
      { soldOut: !car.soldOut }, // 👈 only send soldOut
      { withCredentials: true }
    );

    const updatedCar = res.data.data;

    setCars((prev) =>
      prev.map((c) => (c._id === updatedCar._id ? updatedCar : c))
    );

    alert(`Car marked as ${updatedCar.soldOut ? "Sold Out" : "Available"}`);
  } catch (error) {
    console.error("Toggle soldOut failed:", error);
    alert("Failed to update car status");
  }
};






  const stats = {
    total: cars.length,
    available: cars.filter(car => car.Mode === 'Now Available Cars').length,
    upcoming: cars.filter(car => car.Mode === 'Upcoming Cars').length,
    avgPrice: cars.length > 0 ? Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length) : 0
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Admin Dashboard</h1>
          <p className="text-gray-600">Manage your car inventory efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Cars</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Now</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-orange-600">{stats.upcoming}</p>
              </div>
              <Plus className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Price</p>
                <p className="text-2xl font-bold text-purple-600">₹{stats.avgPrice.toLocaleString()}</p>
              </div>
              <List className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 font-medium ${activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <List className="inline w-4 h-4 mr-2" />
              Car List
            </button>
            <button
              onClick={() => {
                setActiveTab('add');
                setEditingCar(null);
                reset();
                setPreviews([]);
              }}
              className={`px-6 py-3 font-medium ${activeTab === 'add'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Plus className="inline w-4 h-4 mr-2" />
              Add Car
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'list' ? (
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cars by name, model, or registration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Cars</option>
                    <option value="Now Available Cars">Available Now</option>
                    <option value="Upcoming Cars">Upcoming</option>
                  </select>
                </div>
              </div>

              {/* Car List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price & Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCars.map((car) => (
                      <tr key={car._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{car.name} {car.model}</div>
                            <div className="text-sm text-gray-500">{car.Regnumber}</div>
                            <div className="text-sm text-gray-500">{car.color} • {car.Makeyear}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{car.fuel} • {car.Enginecapacity}</div>
                          <div className="text-sm text-gray-500">{car.KMdriven.toLocaleString()} km</div>
                          <div className="text-sm text-gray-500">{car.Ownership}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{car.price.toLocaleString()}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${car.Mode === 'Now Available Cars'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                            }`}>
                            {car.Mode === 'Now Available Cars' ? 'Available' : 'Upcoming'}
                          </span>
                          <div className="text-sm text-gray-500">{car.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(car)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(car._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            {/* Sold Out Toggle */}
                            <button
                              onClick={() => handleToggleSoldOut(car)}
                              className={`p-1 rounded ${car.soldOut ? "text-gray-600" : "text-green-600"}`}
                              title={car.soldOut ? "Mark as Available" : "Mark as Sold Out"}
                            >
                              {car.soldOut ? (
                                <Eye className="h-4 w-4" /> // 👁 when sold out
                              ) : (
                                <Car className="h-4 w-4" /> // 🚗 when available
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCars.length === 0 && (
                  <div className="text-center py-8">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || filterStatus !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by adding a new car.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {editingCar ? 'Edit Car' : 'Add a New Car'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Car Brand Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Brand Name</label>
                    <input
                      {...register("name", { required: "Required" })}
                      placeholder="e.g., Toyota"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                    <select
                      {...register("model", { required: "Please select car model" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose car model</option>
                      {CarsData.CarBrands.map((maker, index) => (
                        <option key={index} value={maker.brand}>{maker.brand}</option>
                      ))}
                    </select>
                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
                  </div>

                  {/* Fuel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select
                      {...register('fuel', { required: "Please select fuel type" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose fuel type</option>
                      <option value='Petrol'>Petrol</option>
                      <option value='Diesel'>Diesel</option>
                    </select>
                    {errors.fuel && <p className="text-red-500 text-sm mt-1">{errors.fuel.message}</p>}
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                    <select
                      {...register('service', { required: "Please select service type" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose service type</option>
                      <option value='company service record'>Company Service Record</option>
                      <option value='Authorised Service Centre'>Authorised Service Centre</option>
                    </select>
                    {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability Mode</label>
                    <select
                      {...register('Mode', { required: "Please select mode type" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose mode type</option>
                      <option value='Upcoming Cars'>Upcoming Cars</option>
                      <option value='Now Available Cars'>Now Available Cars</option>
                    </select>
                    {errors.Mode && <p className="text-red-500 text-sm mt-1">{errors.Mode.message}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      {...register("location", { required: "Required" })}
                      placeholder="e.g., Bangalore"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                  </div>

                  {/* Negotiation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Negotiation</label>
                    <select
                      {...register("negotiation", { required: "Required" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose negotiation option</option>
                      <option value='Available'>Negotiation Available</option>
                      <option value='Not Available'>No Negotiation</option>
                    </select>
                    {errors.negotiation && <p className="text-red-500 text-sm mt-1">{errors.negotiation.message}</p>}
                  </div>

                  {/* Bank Loan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Loan</label>
                    <select
                      {...register("bank", { required: "Required" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose bank loan option</option>
                      <option value='Available'>Bank Loan Available</option>
                      <option value='Not Available'>Bank Loan Not Available</option>
                    </select>
                    {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank.message}</p>}
                  </div>

                  {/* KM Driven */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">KM Driven</label>
                    <input
                      type="number"
                      {...register("KMdriven", { required: 'Required', min: { value: 0, message: "KM driven cannot be negative" } })}
                      placeholder="e.g., 25000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.KMdriven && <p className="text-red-500 text-sm mt-1">{errors.KMdriven.message}</p>}
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission (Gears)</label>
                    <input
                      type="number"
                      {...register("Transmission", { required: "Required", min: { value: 1, message: "Must be at least 1" } })}
                      placeholder="e.g., 5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.Transmission && <p className="text-red-500 text-sm mt-1">{errors.Transmission.message}</p>}
                  </div>

                  {/* Engine Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity</label>
                    <input
                      {...register("Enginecapacity", { required: "Required" })}
                      placeholder="e.g., 1.8L"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.Enginecapacity && <p className="text-red-500 text-sm mt-1">{errors.Enginecapacity.message}</p>}
                  </div>

                  {/* Ownership */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ownership</label>
                    <select
                      {...register("Ownership", { required: "Required" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue=''
                    >
                      <option value='' disabled>Choose ownership type</option>
                      <option value='1st Owner'>1st Owner</option>
                      <option value='2nd Owner'>2nd Owner</option>
                      <option value='3rd Owner'>3rd Owner</option>
                      <option value='4+ Owner'>4+ Owner</option>
                    </select>
                    {errors.Ownership && <p className="text-red-500 text-sm mt-1">{errors.Ownership.message}</p>}
                  </div>

                  {/* Make Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make Year</label>
                    <input
                      type="number"
                      {...register("Makeyear", {
                        required: "Required",
                        min: { value: 1900, message: "Not a valid year" },
                        max: { value: new Date().getFullYear(), message: "Invalid year" }
                      })}
                      placeholder="e.g., 2020"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.Makeyear && <p className="text-red-500 text-sm mt-1">{errors.Makeyear.message}</p>}
                  </div>

                  {/* Registration Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                    <input
                      {...register("Regnumber", { required: "Required" })}
                      placeholder="e.g., KA01AB1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.Regnumber && <p className="text-red-500 text-sm mt-1">{errors.Regnumber.message}</p>}
                  </div>

                  {/* Insurance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                    <input
                      {...register("Insurance", { required: "Required" })}
                      placeholder="e.g., Valid till 2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.Insurance && <p className="text-red-500 text-sm mt-1">{errors.Insurance.message}</p>}
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      {...register("color")}
                      placeholder="e.g., White"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="1"
                      {...register("price", {
                        required: "Required",
                        min: { value: 0, message: "Must be ≥ 0" }
                      })}
                      placeholder="e.g., 1500000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("images")}
                    // onChange={(e) => {
                    //   const files = Array.from(e.target.files);

                    //   // create preview URLs for new files
                    //   const newUrls = files.map((file) => URL.createObjectURL(file));

                    //   // keep existing previews + new ones
                    //   setPreviews((prev) => [...prev, ...newUrls]);

                    //   // also update react-hook-form field
                    //   // const oldFiles = watch("images") || [];
                    //   // const mergedFiles = [...oldFiles, ...files];
                    //   // setValue("images", mergedFiles, { shouldValidate: true });
                    // }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
                  )}

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="h-32 w-full object-cover rounded-md border"
                          />
                          {/* Delete Icon */}
                          <button
                            type="button"
                            onClick={() => {
                              setPreviews((prev) => prev.filter((_, i) => i !== idx));
                              setValue(
                                "images",
                                (watch("images") || []).filter((_, i) => i !== idx)
                              );
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                  >
                    {editingCar ? "Update Car" : "Add Car"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
