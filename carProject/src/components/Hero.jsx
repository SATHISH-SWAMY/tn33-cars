import React from 'react'
import Search from './Search'
import { Button } from "@/components/ui/button"
import CarsData from './Shared/CarsData'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function Hero() {
  return (
    <div className="bg-[#e04c4c] w-full">
      <div className="flex flex-col items-center px-6 py-16 lg:py-20 gap-6 max-w-7xl mx-auto text-center">
        <h2 className="text-sm sm:text-base text-white tracking-wide">
          Find cars for sale and for buy near you
        </h2>
        <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold text-white">
          Find Your Dream Car
        </h1>

        <div className="w-full max-w-3xl">
          <Search />
        </div>

        {/* Brand Logos */}
        <div className="mt-10 w-full bg-white rounded-2xl shadow-md p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            {CarsData.brandLogo.slice(0, 9).map((item, idx) => (
              <img
                key={idx}
                src={item.image}
                width={70}
                className="shadow-sm hover:shadow-2xl hover:scale-105 transition rounded-2xl cursor-pointer"
                alt={`Brand ${idx}`}
              />
            ))}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#e04c4c] text-white px-6">View All Brands</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-gray-700">All Brands</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-6 justify-center py-4">
                    {CarsData.brandLogo.slice(9).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        width={70}
                        className="shadow-sm transition-all hover:shadow-2xl hover:scale-105 rounded-2xl cursor-pointer"
                        alt={`Brand logo ${index + 10}`}
                      />
                    ))}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Hero Image */}
        <img
          src="/heroCar.png"
          alt="Hero car"
          className="mt-10 w-full max-w-5xl object-contain"
        />
      </div>
    </div>
  )
}

export default Hero
