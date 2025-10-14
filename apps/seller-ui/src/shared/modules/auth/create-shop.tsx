import { shopCategories } from '@/utils/categories';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';

const CreateShop = ({
    sellerId,
    setActiveStep
}: {
    sellerId: string;
    setActiveStep:(step: number) => void
}) => {

     const {
            register,
            handleSubmit,
            formState: {errors}
        } = useForm();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
             data
            )

            return response.data
    },
    onSuccess: () => {
        setActiveStep(3)
    }
  })  
  
  const onSubmit = async(data:any) => {
    const shopData = {...data, sellerId}
    shopCreateMutation.mutate(shopData)
  }

  const countWords = (text: string) => text.trim().split(/s*/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
 <h3 className='mb-4 text-2xl font-semibold text-center'>
                        Setup new shop
                    </h3>

                    <label className='block mb-1 text-gray-700'>Name *</label>
                    <input type="text" placeholder='Shop Name'
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

                    <label className='block mb-1 text-gray-700'>Bio (Max 100 words) *</label>
                    <input
                      type="text"
                      placeholder='shop bio'
                      className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                       {...register("bio", {
                        required: "bio is required",
                        validate: (value) => 
                          countWords(value) <= 100 || "Bio can't exceed 100 words"
                    })}
                      />
                      {errors.bio && (
                        <p className='text-sm text-red-500'>
                            {String(errors.bio.message)}
                        </p>
                    )}

                     <label className='block mb-1 text-gray-700'>Address *</label>
                    <input type="text" placeholder='Shop Location'
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("address", {
                        required: "Shop Address is required"
                    })}
                    />
                    {errors.address && (
                        <p className='text-sm text-red-500'>
                            {String(errors.address.message)}
                        </p>
                    )}


                    <label className='block mb-1 text-gray-700'>Opening Hours *</label>
                    <input type="text" 
                    placeholder='eg. Mon-Fri 9AM - 6PM'
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("opening_hours", {
                        required: "Opening Hours are required"
                    })}
                    />
                    {errors.opening_hours && (
                        <p className='text-sm text-red-500'>
                            {String(errors.opening_hours.message)}
                        </p>
                    )}

                        <label className='block mb-1 text-gray-700'>Website</label>
                    <input type="url" 
                    placeholder='https://example.com'
                    className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                    {...register("website", {
                        pattern: {
                          value: /^(https?):\/\/([da-z.-]+)\.([a-z.]{2,6})([/\w .-]+)*\/?$/,
                          message: "Enter a valid URL"
                        }
                    })}
                    />
                    {errors.website && (
                        <p className='text-sm text-red-500'>
                            {String(errors.website.message)}
                        </p>
                    )}

                      <label className='block mb-1 text-gray-700'>Category *</label>
                                        <select 
                                        className='w-full p-2 mb-1 border border-gray-300 rounded-sm outline-0'
                                        {...register("category", {
                                            required: "Category is required",
                                            
                                        })}
                                        >
                                            <option value="">Select your category</option>
                                            {shopCategories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                    
                                        </select>
                    
                                           {errors.category && (
                                            <p className='text-sm text-red-500'>
                                                {String(errors.category.message)}
                                            </p>
                                        )}

                  <button 
                    type="submit" 
                    className='w-full p-2 mt-4 mb-1 text-white bg-black border border-gray-300 rounded-sm outline-0'>
                        Create
                    </button>  
      </form>
    </div>
  )
}

export default CreateShop
