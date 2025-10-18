import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import Input from '../input'
import { Plus, X } from 'lucide-react'

const CustomProperties = ({control, errors}: any) => {
    const [properties, setProperties] = useState<{ label: string; values: string[]}[]>([])
    const [newLabel, setNewLabel] = useState("")
     const [newValue, setNewValue] = useState("")

  return (
    <div>
        
        <div className='flex flex-col gap-3'>
    
                    <Controller
                        name="customProperties"
                        control={control}
                        render={({field}) => {
                            useEffect(() => {
                                field.onChange(properties)
                            }, [properties])

                            const addProperty = () => {
                                if (!newLabel.trim()) return;
                                setProperties([...properties, { label: newLabel, values: [] }])
                                setNewLabel("")
                            }

                            const addValue = (index: number) => {
                                if (!newValue.trim()) return;
                                const updatedProperties = [...properties]
                                updatedProperties[index].values.push(newValue)
                                setProperties(updatedProperties)
                                setNewValue("")
                            }

                            const removeProperty = (index: number) => {
                                setProperties(properties.filter((_, i) => i !== index))
                            }

                            return(
                              <div className='mt-2'>
                                <label className='block mb-1 font-semibold text-gray-300'>
                                    Custom Properties
                                </label>
                                <div className='flex flex-col gap-3'>
                                    {/* Existing Properties */}
                                    {properties.map((property, index) => (
                                        <div key={index}
                                        className='p-3 bg-gray-900 border border-gray-700 rounded-lg'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span className='font-medium text-white'>
                                                    {property.label}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={()=>removeProperty(index)}
                                                >
                                                    <X size={18} className='text-red-500'/>
                                                </button>
                                            </div>

                                            {/* Add Values to Property */}
                                            <div className='flex items-center gap-2 mt-2'>
                                                <input 
                                                type="text" 
                                                className='w-full p-2 mb-1 text-white bg-gray-800 border border-gray-700 rounded-sm outline-none'
                                                placeholder='Enter value...'
                                                value={newValue}
                                                onChange={(e) => setNewValue(e.target.value)}
                                                />

                                                <button
                                                    type="button"
                                                    className='px-3 py-1 text-white bg-blue-500 rounded-md'
                                                    onClick={()=> addValue(index)}
                                                >
                                                    Add
                                                </button>

                                            </div>
                                            {/* Show Values */}
                                            <div className='flex flex-wrap gap-2 mt-2'>
                                                {property.values.map((value, i)=>(
                                                    <span 
                                                        key={i}
                                                        className='px-2 py-1 text-white bg-gray-700 rounded-md'
                                                    >
                                                        {value}
                                                    </span>
                                                ))}
                                            </div>

                                        </div>
                                    ))}

                                    {/* Add new property */}
                                    <div className='flex items-center gap-2 mt-1'>
                                        <Input
                                            placeholder='Enter property label (eg. Material, Warrenty)'
                                            value={newLabel}
                                            onChange={(e: any) => setNewLabel(e.target.value)}
                                        />
                                        <button
                                            type='button'
                                            className='flex items-center px-3 py-2 text-white bg-blue-500 rounded-md'
                                            onClick={addProperty}
                                        >
                                            <Plus size={16} /> Add
                                        </button>
                                    </div>

                                </div>

                                {errors.customProperties && (
                                    <p className='mt-1 text-xs text-red-500'>
                                    {errors.customProperties.message as string}
                                    </p>
                                )}
                              </div>
                            )
                            
                        }}
                    />
                   
                </div>
           
    </div>
  )
}

export default CustomProperties