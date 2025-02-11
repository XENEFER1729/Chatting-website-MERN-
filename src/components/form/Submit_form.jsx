import React from 'react'

export default function Submit_form({label,className,type,submit,handleonSubmit}) {
  return (
    <div>
      <button type={`${type}`} name={`${submit}`} className={`${className} rounded-full bg-black text-white text-2xl p-3 w-full`} onClick={handleonSubmit} >{label}</button>
    </div>
  )
}
 