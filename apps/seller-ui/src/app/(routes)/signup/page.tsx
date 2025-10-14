"use client";

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, ScanFace } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useRef, useState } from 'react';
import {useForm} from "react-hook-form";
import axios, { AxiosError } from "axios";
import { response } from 'express';
import { countries } from '@/utils/countries';

// type FormData = {
//     name: string;
//     email: string;
//     password: string;
// }

const Signup = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    // const [serverError, setServerError] = useState<string | null>(null);
    const [canResend, setCanResend] = useState(true)
    const [timer, setTimer] = useState(60)
    const [showOtp, setShowOtp] = useState(false)
    const [otp, setOtp] = useState(["", "", "", ""])
    const [userData, setUserData] = useState<FormData | null>(null)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();

    const startResendTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if(prev <= 1){
                    clearInterval(interval)
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const signUpMutation = useMutation({
        mutationFn: async(data:FormData) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
                 data
            )
            return response.data
        },
        onSuccess: (_, formData) => {
            setUserData(formData)
            setShowOtp(true)
            setCanResend(false)
            setTimer(60)
            startResendTimer()
        }
    })

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if(!userData) return
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,{
                ...userData,
                otp: otp.join("")
            })
           return response.data     
            
        },
        onSuccess: () => {
            router.push("/login")
        }
    })

    const onSubmit = (data:any) => {
        signUpMutation.mutate(data)
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp)

        if(value && index < inputRefs.current.length - 1){
            inputRefs.current[index + 1]?.focus();
        }

    }

    const handleOtpKeyDown = (index:number, e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Backspace" && !otp[index] && index > 0){
            inputRefs.current[index -1]?.focus()
        }
    }

    const resendOtp = () => {
        if(userData){
            signUpMutation.mutate(userData)
        }
    }

  return (
    <div className='flex flex-col items-center w-full min-h-screen pt-10'>
        {/* Stepper */}
        <div className='relative flex items-center justify-between md:w-[50%] mb-8'>
            <div className='absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10' />
            {[1,2,3].map((step) => (
                <div key={step}>
                    <div 
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                        step <= activeStep ? "bg-blue-600": "bg-gray-300"
                        }`}>
                            {step}
                    </div>
                    <span className='ml-[-15px]'>
                        {step === 1 ? "Create Account" : step === 2 ? "Setup Shop": "Connect Bank"}
                    </span>
                </div>
            ))}
        </div>

            {/* Steps Content */}
            <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
                {activeStep === 1 && (
                    <>
                     {
                !showOtp ? (
 <form onSubmit={handleSubmit(onSubmit)}>
                    <h3 className='mb-4 text-2xl font-semibold text-center'>
                        Create Account
                    </h3>
                    <label className='block mb-1 text-gray-700'>Name</label>
                    <input type="text" placeholder=''
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("name", {
                        required: "Name is required"
                    })}
                    />
                    {errors.name && (
                        <p className='text-sm text-red-500'>
                            {String(errors.name.message)}
                        </p>
                    )}

                      <label className='block mb-1 text-gray-700'>Email</label>
                    <input type="email" placeholder=''
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address"
                        }
                    })}
                    />
                    {errors.email && (
                        <p className='text-sm text-red-500'>
                            {String(errors.email.message)}
                        </p>
                    )}

                    <label className='block mb-1 text-gray-700' >Phone Number</label>
                    <input type="tel" placeholder='' className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("phone_number", {
                        required: "Phone Number is required",
                        pattern: {
                            value: /^\+?[1-9]\d{1,14}$/,
                            message: "Invalid phone number format"
                        },
                        minLength: {
                            value: 10,
                            message: "Phone number must be at least 10 digits"
                        },
                        maxLength: {
                            value: 10,
                            message: "Phone number cannot exceeds 15 digits"
                        }
                    })}
                    />

                      {errors.phone_number && (
                        <p className='text-sm text-red-500'>
                            {String(errors.phone_number.message)}
                        </p>
                    )}

                    <label className='block mb-1 text-gray-700'>Country</label>
                    <select 
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("country", {
                        required: "Country is required",
                        
                    })}
                    >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}

                    </select>

                       {errors.country && (
                        <p className='text-sm text-red-500'>
                            {String(errors.country.message)}
                        </p>
                    )}

                
                    <label className='block mb-1 text-gray-700'>Password</label>
                    <div className='relative'>
                          <input type={passwordVisible ? "text" : "password"} 
                          placeholder='Min. 6 characters'
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                    />

                    <button 
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className='absolute inset-y-0 flex items-center text-gray-400 right-3'
                    >
                        {passwordVisible ? <Eye/> : <EyeOff/>}
                    </button>
                    {errors.password && (
                             <p className='text-sm text-red-500'>
                            {String(errors.password.message)}
                        </p>
                    )}

                 
                    </div>
                   
                    <button 
                    type="submit" 
                    disabled={signUpMutation.isPending}
                    className='w-full p-2 mt-4 mb-1 text-white bg-black border border-gray-300 rounded-sm outline-0'>
                        {signUpMutation.isPending ? "Signing up..." : "Signup"}
                    </button>
                       {
                        signUpMutation.isError && 
                        signUpMutation.error instanceof AxiosError && (
                            <p className='mt-2 text-sm text-red-500'>
                                {signUpMutation.error.response?.data?.message ||
                                signUpMutation.error.message}
                            </p>
                        )
                        }

                        <p className='pt-3 text-center'>
                            Already have an account?{" "}
                            <Link href={"/login"} className='text-blue-500'>
                                Login
                            </Link>
                        </p>
                </form>
                ): (
                    <div>
                        <h3 className='mb-4 text-xl font-semibold text-center'>Enter OTP</h3>
                        <div className='flex justify-center gap-6'>
                            {otp?.map((digit, index)=>(
                                <input 
                                key={index} 
                                type="text" 
                                ref={(el) => {
                                    if (el) inputRefs.current[index] = el;
                                }}
                                maxLength={1}
                                className='w-12 h-12 text-center border border-gray-300 rounded outline-none'
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                />
                            ))}
                        </div>
                        <button className='w-full py-2 mt-4 text-lg text-white bg-blue-500 rounded-lg cursor-pointer'
                            disabled={verifyOtpMutation.isPending}
                            onClick={()=>verifyOtpMutation.mutate()}
                        >
                            {verifyOtpMutation.isPending ? "Verifying...": "Verify OTP"}
                        </button>
                        <p className='mt-4 text-sm text-center'>
                            {canResend ? 
                                (<button 
                                    onClick={resendOtp}
                                    className='text-blue-500 cursor-pointer'
                                >Resend OTP</button>):(`Resend OTP in ${timer}s`)
                            }
                        </p>
                        {
                        verifyOtpMutation.isError && 
                        verifyOtpMutation.error instanceof AxiosError && (
                            <p className='mt-2 text-sm text-red-500'>
                                {verifyOtpMutation.error.response?.data?.message ||
                                verifyOtpMutation.error.message}
                            </p>
                        )
                        }
                        
                    </div>
                )
               }
                    </>
                )}
            </div>

       
    </div>
    
  )
}

export default Signup