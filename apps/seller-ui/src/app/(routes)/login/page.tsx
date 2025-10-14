"use client";

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff, ScanFace } from 'lucide-react';
//import GoogleButton from '@/shared/components/google-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {useForm} from "react-hook-form";

type FormData = {
    email: string;
    password: string;
}

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormData>();

    const loginMutation = useMutation({
        mutationFn: async(data:FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
                data,
                {withCredentials: true}
            )
            return response.data
        },
        onSuccess: (data) => {
            setServerError(null)
            router.push("/")
        },
        onError: (error: AxiosError) =>{
            console.log("cannt login")
            const errorMessage = (error.response?.data as {message?: string})?.message || "Invalid Credentials!"
            setServerError(errorMessage)
        }
    })

    const onSubmit = (data:FormData) => {
        loginMutation.mutate(data)
    }

  return (
    <div className='w-full py-10 min-h-screen bg-[#f1f1f1]'>
        <h1 className='text-4xl font-semibold text-center text-black font-Poppins'>
            Login
        </h1>
        <p className='text-center text-lg font-medium py-3 text-[#00000099]'>
            Home . Login
        </p>
        <div className='flex justify-center w-full'>
            <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
                <h3 className='mb-2 text-3xl font-semibold text-center'>
                    Login to Eshop
                </h3>
                <p className='mb-4 text-center text-gray-500'>
                    Don't have an account?{" "}
                    <Link href={"/signup"} className='text-blue-500'>
                    Sign up
                    </Link>
                </p>
            
           

                <div className='flex items-center my-5 text-sm text-gray-100'>
                    <div className='flex-1 border-t border-gray-300'/>
                    <span className='px-3'>or Sign in with Email</span>
                    <div className='flex-1 border-t border-gray-300'/>    
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
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
                       <div className='flex items-center justify-between my-4'>
                        <label className='flex items-center text-gray-600'>
                            <input 
                            type="checkbox" 
                            className='mr-2' 
                            checked={rememberMe}
                            onChange={()=>setRememberMe(!rememberMe)}
                            />
                            Remember Me
                        </label>
                        <Link href={"/forgot-password"}
                        className='text-sm text-blue-500'>
                            Forgot Password?
                        </Link>
                    </div>
                    <button 
                    type="submit" 
                    disabled={loginMutation.isPending}
                    className='w-full p-2 mb-1 text-white bg-black border border-gray-300 rounded-sm outline-0'>
                        {loginMutation.isPending ? "Loggin in" : "Login"}
                    </button>
                    {serverError && (
                        <p className='mt-2 text-sm text-red-500'>{serverError}</p>
                    )}
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login