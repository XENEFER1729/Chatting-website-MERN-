import React from 'react'

export default function Contact_single({index,room,Avatar,handleAvatar}) {
    return (
        <div key={index} className="flex border-2 overflow-hidden bg-primary text-white border-gray-900 p-2 rounded-lg mb-2 mr-3 py-4 cursor-pointer">
            <div className="border-2 bg-gray-500 border-white rounded-full mr-4 overflow-hidden flex justify-center items-center cursor-pointer" >
                <input type='file'
                style={{maxHeight:"100px",maxWidth:"50px",borderRadius:"50%"}}
                className='rounded-full absolute z-1 cursor-pointer opacity-0 overflow-hidden ' onChange={handleAvatar} />
                <img src={Avatar} alt="Dp" style={{maxHeight:"50px",maxWidth:"50px"}} />
            </div>
            <div>
                <h3 className="font-semibold text-xl">{room}</h3>
                <h3>Room</h3>
            </div>
        </div>
    )
}
