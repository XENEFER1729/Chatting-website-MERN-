import React from 'react'

export default function Input({ app, 
  username, placeholder,
  className,type,
  value,onChange=(e)=>{} }) {
  return (
    <div className='text-start flex flex-col text-xl'>
      <h1>{username}</h1>
      <input type={`${type}`}
       placeholder={`${placeholder}`}
        className={` ${className} pl-1 h-9 bg-[rgba(255,255,255,0.5)] focus:outline-none border-2 border-gray-500 shadow-xl text-black`}
        value={value}
        onChange={onChange}
         />
    </div>
  )
}

