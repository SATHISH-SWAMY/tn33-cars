import React, { useEffect, useState } from 'react';
import Caritem from './Caritem';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from 'axios';


function MostSearchedCar() {
  const [cars, setCars] = useState([]);
  console.log("cars",cars);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cars from backend
  useEffect(() => {
     setLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}/cars/get-cars`,{ withCredentials: true })
      .then((res) => {
        console.log("Fetched cars:", res.data);
         setCars(res.data);
         setLoading(false)
      })
      .catch((err) => {
         console.error("Error fetching cars:", err);
      });
  }, []);

  return (
    <div>
      <div className="px-4 sm:px-8  md:px-12 lg:px-24  mx-auto mt-20">
      <h2 className="font-bold text-3xl text-center mb-12">Now Available Cars</h2>

      {loading && <p className="text-center">Loading cars...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && cars.length > 0 && (
        <Carousel>
          <CarouselContent>
            {cars.map((car, index) => (
              <CarouselItem
                key={car._id || index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
                <Caritem car={car} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      {!loading && !error && cars.length === 0 && (
        <p className="text-center text-gray-500">No cars available.</p>
      )}
    </div>
      <div className="px-4 sm:px-8  md:px-12 lg:px-24  mx-auto mt-20">
      <h2 className="font-bold text-3xl text-center mb-12">Upcoming Cars</h2>

      {loading && <p className="text-center">Loading cars...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && cars.length > 0 && (
        <Carousel>
          <CarouselContent>
            {cars.map((car, index) => (
              <CarouselItem
                key={car._id || index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
                <Caritem car={car} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      {!loading && !error && cars.length === 0 && (
        <p className="text-center text-gray-500">No cars available.</p>
      )}
    </div>
    </div>
    
  );
}

export default MostSearchedCar;
