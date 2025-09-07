import React, { useState, useEffect } from 'react';
import Header from './Header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Caritem from './Caritem';
import axios from 'axios';
function AllCarsList() {
  const [cars, setCars] = useState([]);
  const [sort, setSort] = useState("");

useEffect(() => {
  axios.get(`https://api-tn33-cars.onrender.com/cars/get-cars`,{ withCredentials: true }) // if session needed
    .then((res) => {
      console.log("Fetched cars:", res.data);
      setCars(res.data);
    })
    .catch((err) => {
      console.error("Error fetching cars:", err);
    });
}, []);

  // Optional sorting by price or name (enhance as needed)
  const sortedCars = [...cars].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });

  return (
    <div>
      <Header />
      <div className="p-5 max-w-screen-xl mx-auto">
        {/* Top Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-lg text-gray-700">
            Showing <span className="font-semibold">{cars.length}</span> Cars
          </h2>

          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">Sort By</span>
            <Select onValueChange={setSort}>
              <SelectTrigger className="w-40 text-base bg-white border border-gray-300">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Car Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {sortedCars.map((car, index) => (
            <Caritem key={car._id || index} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllCarsList;
