import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CiSearch } from "react-icons/ci";
import CarsData from './Shared/CarsData';
import axios from 'axios';

function Search() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      carType: '',
      carMaker: '',
      pricing: '',
    },
  });



const onSubmit = async (data) => {
  try {
    // Remove empty filters so they don't appear in query string
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/cars/filter-cars`, {
      params: filteredData, // Axios will handle query string encoding
    });

    console.log("Filtered Cars:", res.data);
  } catch (error) {
    console.error("Error fetching filtered cars:", error);
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 md:py-5 md:px-6 rounded-md md:rounded-full w-full max-w-5xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 shadow-sm"
    >
      {/* Car Type */}
      <div className="flex-1">
        <Controller
          name="carType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full text-base border-none outline-none shadow-none">
                <SelectValue placeholder="Car" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="old">Old</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Separator orientation="horizontal" className="block md:hidden" />
      <Separator orientation="vertical" className="hidden md:block h-8" />

      {/* Car Makers */}
      <div className="flex-1">
        <Controller
          name="carMaker"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full text-base border-none outline-none shadow-none">
                <SelectValue placeholder="Car Makers" />
              </SelectTrigger>
              <SelectContent>
                {CarsData.brandLogo.map((maker, index) => (
                  <SelectItem key={index} value={maker.name}>{maker.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Separator orientation="horizontal" className="block md:hidden" />
      <Separator orientation="vertical" className="hidden md:block h-8" />

      {/* Pricing */}
      <div className="flex-1">
        <Controller
          name="pricing"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full text-base border-none outline-none shadow-none">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                {CarsData.pricing.map((price, index) => (
                  <SelectItem key={index} value={price.amount}>{price.amount}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Submit (Search Icon) */}
      <button type="submit" className="self-center md:self-auto">
        <CiSearch className="text-[44px] bg-blue-600 rounded-full p-2 text-white hover:scale-105 transition-all cursor-pointer" />
      </button>
    </form>
  );
}

export default Search;
