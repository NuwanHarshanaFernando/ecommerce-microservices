'use client';
import ImagePlaceHolder from '@/shared/components/image-placeholder';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Input from '../../../../../../../packages/components/input';
import ColorSelector from '../../../../../../../packages/components/color-selector';
import CustomSpecifications from '../../../../../../../packages/components/custom-specifications';
import CustomProperties from '../../../../../../../packages/components/custom-properties';

const Page = () => {
  const {register, control, watch, setValue, handleSubmit, formState: {errors}} = useForm()
  const [openImageModal, setOpenImageModal] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [images, setImages] = useState<(File | null)[]>([null])
  const [loading, setLoading] = useState(false)
  
  const onSubmit = (data: any) => {
    console.log(data)
  }

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images]

    updatedImages[index] = file

    if(index === images.length - 1 && images.length < 8){
      updatedImages.push(null)
    }

    setImages(updatedImages)
    setValue("images", updatedImages)
  }

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) =>{
      let updatedImages = [...prevImages]

      if(index === -1){
        updatedImages[0] = null
      } else {
        updatedImages.splice(index,1)
      }

      if(!updatedImages.includes(null) && updatedImages.length < 8){
        updatedImages.push(null)
      }

      return updatedImages;
    })

    setValue("images", images)
  }
  
  return (
    <form className='w-full p-8 mx-auto text-white rounded-lg shadow-md'
    onSubmit={handleSubmit(onSubmit)}>
        {/* Heading & Breadcrumbs */}
        <h2 className='py-2 text-2xl font-semibold text-white font-Poppins'>
          Create Product
        </h2>
        <div className='flex items-center '>
          <span className='text-[#80Deea] cursor-pointer'>Dashboard</span>
          <ChevronRight size={20} className='opacity-[.8]'/>
          <span>Create Product</span>
        </div>

        {/* Content Layout*/}
        <div className='flex w-full gap-6 py-4'>
        {/* Left side - Image upload section */}
            <div className='md:w-[35%]'>
              {images?.length > 0 && (
                <ImagePlaceHolder
                  setOpenImageModal={setOpenImageModal}
                  size="765 x 850"
                  small={false}
                  index={0}
                  onImageChange={handleImageChange}
                  onRemove={handleRemoveImage}
                />
              )}
                 <div className='grid grid-cols-2 gap-3 mt-4 '>
              {images.slice(1).map((_, index) => (
                <ImagePlaceHolder
                  setOpenImageModal={setOpenImageModal}
                  size="765 x 850"
                  key={index}
                  small
                  index={index + 1}
                  onImageChange={handleImageChange}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>
            </div>

         

            {/* Right Side - form inputs*/}
        <div className='md:w-[65%]'>
              <div className='flex w-full gap-6'>
                {/* Product Title Input */}
                <div className='w-2/4'>
                  <Input 
                     label='Product Title *' placeholder='Enter product title'
                     {...register("title", {required: "Title is required!"})}
                  />
                  {errors.title && (
                    <p className='mt-1 text-xs text-red-500'>
                       {errors.title.message as string}
                    </p>
                  )}

{/* Product Description Input */}
                <div className='mt-2'>
                  <Input 
                     type="textarea" rows={7} cols={10}
                     label='Short Description * (Max 150 words)' 
                     placeholder='Enter product description for quick view'
                     {...register("description", {required: "Description is required!",
                      validate: (value) => {
                        const wordCount = value.trim().split(/\s*/).length;
                        return (
                          wordCount <= 150 || 
                          `Description cannot exceed 150 words (Current: ${wordCount})`
                        )
                      }
                     })}
                  />
                  {errors.description && (
                    <p className='mt-1 text-xs text-red-500'>
                       {errors.description.message as string}
                    </p>
                  )}
                </div>

                {/* Product Tags */}
                <div className='mt-2'>
                   <Input 
                     label='Tags *' placeholder='apple,flagship'
                     {...register("tags", {
                      required: "Seperate related product tags with a coma ,"
                    })}
                  />
                  {errors.tags && (
                    <p className='mt-1 text-xs text-red-500'>
                       {errors.tags.message as string}
                    </p>
                  )}
                </div>

                  {/* Product Warrenty */}
                <div className='mt-2'>
                   <Input 
                     label='Warrenty *' placeholder='1 Year / No Warrenty'
                     {...register("warrenty", {
                      required: "Warrenty is required!,"
                    })}
                  />
                  {errors.warrenty && (
                    <p className='mt-1 text-xs text-red-500'>
                       {errors.warrenty.message as string}
                    </p>
                  )}
                </div>

                  {/* Product Slug */}
                <div className='mt-2'>
                   <Input 
                     label='Slug *' placeholder='product_slug'
                     {...register("slug", {
                      required: "Slug is required!,",
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message: "Invalid slug format! Use only lowercase letters, numbers"
                      },
                      minLength: {
                        value: 3,
                        message: "Slug must be at least 3 characters long"
                      },
                      maxLength: {
                        value: 50,
                        message: "Slug cannot be longer than 50 characters"
                      }
                    })}
                  />
                  {errors.slug && (
                    <p className='mt-1 text-xs text-red-500'>
                       {errors.slug.message as string}
                    </p>
                  )}
                </div>

                    {/* Brand */}
                <div className='mt-2'>
                   <Input 
                     label='Brand' placeholder='Apple'
                     {...register("brand")}
                  />
                  {errors.warrenty && (
                    <p className='mt-1 text-xs text-red-500'>
                       {errors.warrenty.message as string}
                    </p>
                  )}
                </div>

                <div className='mt-2'>
                  <ColorSelector control={control} errors={errors}/>
                </div>

                <div className='mt-2' >
                  <CustomSpecifications control={control} errors={errors}/>
                </div>

                
                <div className='mt-2' >
                  <CustomProperties control={control} errors={errors}/>
                </div>

                </div>

   

              </div>
        </div>
        </div>


    </form>
  )
}

export default Page