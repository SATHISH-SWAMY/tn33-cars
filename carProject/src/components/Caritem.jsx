import React from 'react'
import { Separator } from "@/components/ui/separator"
import { BsFillFuelPumpFill } from "react-icons/bs";
import { RiSpeedUpFill } from "react-icons/ri";
import { GiGearStickPattern } from "react-icons/gi";
import { IoMdOpen } from "react-icons/io";
import { Link, useNavigate } from 'react-router';

function Caritem({ car }) {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/SingleProductPage', { state: { car } })
    };

    return (
        <>
            <div onClick={handleCardClick} className=' rounded-t-xl bg-white  border hover:shadow-2xl cursor-p hover:scale-105 transition-all mb-10 mt-10' >
                <h2 className='absolute m-2 bg-green-400 rounded-full test-sm  px-2 text-white '>New</h2>
                <div className='w-full flex  h-64 ' >
                    <img src={car?.images[0]} // ✅ Display first image
                        alt={car?.name}
                        height={250} className='rounded-t-xl w-full' />
                </div>
                <div>
                    <h2 className='font-bold text-xl text-center mt-2 ' >{car?.name}</h2>
                    <Separator className="my-4" />
                    <div className='flex grid-col-3 mt-5 gap-10 px-3' >
                        <div className='flex flex-col items-center' >
                            < RiSpeedUpFill className='text-lg mb-2' />
                            <h2>{car.KMdriven} Miles</h2>
                        </div>
                        <div className='flex flex-col items-center' >
                            <BsFillFuelPumpFill className='text-lg mb-2' />
                            <h2>{car.fuel} </h2>
                        </div>
                        <div className='flex flex-col items-center' >
                            <GiGearStickPattern className='text-lg mb-2' />
                            <h2>{car.Transmission} </h2>
                        </div>
                    </div>
                    <Separator className="my-2" />
                    <div className='flex items-center justify-between p-3' >
                        <h2 className='font-bold text-xl'>{car.price}</h2>

                        <h2 className=' text-orange-700 text-sm flex gap-2 items-center cursor-pointer' >
                            View Details
                            <IoMdOpen />
                        </h2>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Caritem