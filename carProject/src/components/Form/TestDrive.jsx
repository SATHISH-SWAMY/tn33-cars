import React, { useEffect } from 'react';
import Header from '../Header';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from "sweetalert2";

function TestDrive() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm(
        {
            defaultValues: {
                time: new Date().toLocaleTimeString('en-GB')
            }
        }
    );

    const onSubmit = async (data) => {
        console.log(data);

    }


    return (
        <div>
            <Header />
            <div className='bg-[#e04c4c] h-full'>
                <div className="text-center pt-10">
                    <h2 className="text-2xl font-bold text-white uppercase">Book a Test Drive</h2>
                    <p className="text-white mt-2">Fill out the form below to help us understand your preferences</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="max-w-5xl mx-auto mt-8 bg-white p-8 shadow-md rounded-lg space-y-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-700">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-700">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="e.g. +91 9876543210"
                                    {...register("contact", {
                                        required: "Contact number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Enter a valid 10-digit number",
                                        },
                                    })}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.contact && (
                                    <p className="text-red-500 text-sm">{errors.contact.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-700">
                                    Your Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="City or Town"
                                    {...register("location", { required: "Location is required" })}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm">{errors.location.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Note and Submit */}
                        <div className="bg-yellow-100 p-4 border-l-4 border-yellow-400 text-yellow-800 rounded">
                            <p>
                                <strong>Note:</strong> You will be charged{" "}
                                <span className="font-bold">₹500</span> as a consultation fee.
                                Based on your preferences, we will guide you through the best buying
                                options.
                            </p>
                        </div>

                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
                            >
                                Submit Your Request
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TestDrive