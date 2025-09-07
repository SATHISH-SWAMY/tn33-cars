import React, { useState } from 'react'
import CarsData from './Shared/CarsData'
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Link } from 'react-router'

function Category() {

  const [activeTab, setActiveTab] = useState('buy'); // or 'buy'
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))


  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carModel: '',
    price: '',
  });

  return (
    <div className="mt-20 px-4 sm:px-8 lg:px-20 max-w-[1640px] mx-auto ">
      {/* Sell your car  */}
      {/* <h2 className="font-bold text-3xl text-center mb-10">Sell your car for the Best Price</h2> */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <div className="relative w-[660px] h-16 grid grid-cols-2 bg-gray-100 rounded-lg p-1 mx-auto mb-6 ">
          <div className={`absolute inset-y-1 left-1 w-1/2 bg-[#e04c4c] rounded-lg transition-transform 
      ${activeTab === 'sell' ? 'translate-x-full' : 'translate-x-0'}`}></div>

          <button onClick={() => setActiveTab('buy')}
            className={`relative z-10 font-medium transition-colors cursor-pointer
        ${activeTab === 'buy' ? 'text-white' : 'text-gray-700'}`}>Buy cars</button>

          <button onClick={() => setActiveTab('sell')}
            className={`relative z-10 font-medium transition-colors cursor-pointer
        ${activeTab === 'sell' ? 'text-white' : 'text-gray-700'}`}>Sell cars</button>
        </div>

        {/** Banner Section */}
        <div className="space-y-4">
          <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm text-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeTab === 'buy' ? 'Find Your Dream Car ' : 'Get Your Car Evaluated '}
              </h2>
            </div>


            <div className="text-gray-600 text-sm max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                <div className="flex-shrink-0 w-full md:w-[500px]">
                  <Carousel plugins={[plugin.current]} className="w-full max-w-xs">
                    <CarouselContent>
                      {CarsData.customerSatisfactionImages.map((i) => (
                        <CarouselItem key={i.id}>
                          <div >
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center ">
                                <img src={i.image} className="w-[600px] h-[500px] object-cover rounded-lg" />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Optional: Add navigation */}
                    {/* <CarouselPrevious />
      <CarouselNext /> */}
                  </Carousel>
                </div>

                <div >
                  <p>
                    {activeTab === 'buy'
                      ? (
                        <div className="flex flex-col items-center p-8 gap-10 bg-gradient-to-br rounded-xl  text-center max-w-3xl mx-auto">
                          {/* Heading */}
                          <h2 className="text-3xl font-bold text-gray-800">
                            Find Your New Car
                          </h2>

                          {/* Subtext */}
                          <p className="text-gray-600 text-base max-w-xl">
                            Discover a wide range of <span className="font-semibold text-blue-600">TN 33 cars®</span> used cars , doorstep test drives, and a 5-day return policy.
                          </p>

                          {/* Benefits */}
                          <div className="w-full text-left">
                            <ul className="text-gray-700 text-sm space-y-2 list-none">
                              <li>✅ 200-point quality check</li>
                              <li>✅ 5-day money-back guarantee</li>
                              <li>✅ 1-year warranty</li>
                              <li>✅ Doorstep test drive & delivery</li>
                            </ul>
                          </div>

                          {/* CTA Button */}
                          <Button className="bg-[#e04c4c] hover:bg-[#c53d3d] px-6 py-3 text-white text-lg rounded-lg transition-all duration-300 shadow-lg  w-90 h-20 cursor-pointer">
                            Browse Cars
                          </Button>
                        </div>

                      )
                      :
                      (
                        <div className="flex flex-col items-center p-8 gap-10 bg-gradient-to-br rounded-xl  text-center max-w-3xl mx-auto ">
                          {/* Heading */}
                          <h2 className="text-3xl font-bold text-gray-800">
                            Sell Your Car For Best Price
                          </h2>

                          {/* Subtext */}
                          <p className="text-gray-600 text-base max-w-xl">
                            Discover a wide range of <span className="font-semibold text-blue-600">TN 33 cars®</span> used cars , doorstep test drives, and a 5-day return policy.
                          </p>

                          {/* Benefits */}
                          <div className="w-full text-left">
                            <ul className="text-gray-700 text-sm space-y-2 list-none">
                              <li>✅ 200-point quality check</li>
                              <li>✅ 5-day money-back guarantee</li>
                              <li>✅ 1-year warranty</li>
                              <li>✅ Doorstep test drive & delivery</li>
                            </ul>
                          </div>

                          {/* CTA Button */}
                          <Link to="/SaleForm" className="w-full">
                            <Button className="bg-[#e04c4c] hover:bg-[#c53d3d] px-6 py-3 text-white text-lg rounded-lg transition-all duration-300 shadow-lg w-90 h-20 cursor-pointer">
                              Get Price
                            </Button>
                          </Link>
                        </div>

                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/** Form fields go below this */}
        </div>

      </div>

      {/* Browse by Type */}
      <h2 className="font-bold text-3xl text-center mb-10">Browse By Type</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {CarsData.Categories.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <img src={item.icon} alt={item.name} width={40} height={40} />
            <h3 className="font-semibold mt-2 text-center text-sm">{item.name}</h3>
          </div>
        ))}
      </div>

      {/* Our Services */}
      <div className="mt-16 bg-[#e04c4c] rounded-2xl py-10 px-4 sm:px-10 w-full">
        <h2 className="font-bold text-3xl text-center text-white mb-10">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {CarsData.services.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 border rounded-xl p-5 flex flex-col items-center justify-between hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-contain mb-4"
              />
              <h3 className="font-semibold text-center">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Category
