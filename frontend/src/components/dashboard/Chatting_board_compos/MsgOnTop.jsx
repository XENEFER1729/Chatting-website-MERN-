import React from 'react'

export default function MsgOnTop({msg,classname}) {
    return (
        <div className='flex justify-center m-1 mt-2 text-center '>
            <h1 className={`${classname} w-fit p-1 rounded-lg`}>{msg}</h1>
        </div>
    )
}
