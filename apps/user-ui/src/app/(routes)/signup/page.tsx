"use client";

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, ScanFace } from 'lucide-react';
//import GoogleButton from '@/shared/components/google-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import {useForm} from "react-hook-form";
import axios, { AxiosError } from "axios";
import { response } from 'express';

type FormData = {
    name: string;
    email: string;
    password: string;
}

const Signup = () => {
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
    } = useForm<FormData>();

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

    const onSubmit = (data:FormData) => {
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
        
    }

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
        <h1 className='text-4xl font-semibold text-center text-black font-Poppins'>
            Signup
        </h1>
        <p className='text-center text-lg font-medium py-3 text-[#00000099]'>
            Home . Signup
        </p>
        <div className='flex justify-center w-full'>
            <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
                <h3 className='mb-2 text-3xl font-semibold text-center'>
                    Signup to Eshop
                </h3>
                <p className='mb-4 text-center text-gray-500'>
                    Already have an account?{" "}
                    <Link href={"/login"} className='text-blue-500'>
                    Login
                    </Link>
                </p>
            
                {/* <GoogleButton/> */}
                <ScanFace/>

                <div className='flex items-center my-5 text-sm text-gray-100'>
                    <div className='flex-1 border-t border-gray-300'/>
                    <span className='px-3'>or Sign in with Email</span>
                    <div className='flex-1 border-t border-gray-300'/>    
                </div>

               {
                !showOtp ? (
 <form onSubmit={handleSubmit(onSubmit)}>

                    <label className='block mb-1 text-gray-700'>Name</label>
                    <input type="text" placeholder=''
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("name", {
                        required: "Name is required"
                    })}
                    />
                    {errors.email && (
                        <p className='text-sm text-red-500'>
                            {String(errors.email.message)}
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
                    {/* {serverError && (
                        <p className='mt-2 text-sm text-red-500'>{serverError}</p>
                    )} */}
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
            </div>
        </div>
    </div>
  )
}

export default Signup