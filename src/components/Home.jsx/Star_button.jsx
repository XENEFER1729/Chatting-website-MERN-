import React from 'react'
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export default function Star_button({b_name,handleOnclick,classname,startSize=15}) {
    return (
        <div>
            <div className="relative inline-block font-semibold">
                {/* Button */}
                <div className="relative inline-block font-semibold">
                    {/* Button */}
                    <button className={`bg-transparent text-white px-6 py-3 rounded-lg hover:border-2 ${classname} max-sm:text-[20px] `}>
                        {b_name}
                    </button>

                    {/* Stars */}
                    <div className="flex absolute top-0 right-0 left-0 bottom-0 bg-primary justify-center items-center hover:border-2 cursor-pointer hover:border-[rgb(0,255,255)] hover:bg-transparent rounded-xl p-2 group" onClick={handleOnclick}>
                        <h1 className={`text-white ${classname} max-sm:text-[20px]`}>{b_name}</h1>

                        {/* Animated Stars */}
                        <Star
                            size={startSize}
                            color="cyan"
                            fill="cyan"
                            className="absolute left-1/2 opacity-0 top-0 group-hover:animate-starburstl duration-1000"
                        />
                        <Star
                            size={startSize}
                            color="cyan"
                            fill="cyan"
                            className="absolute left-1/2 opacity-0 top-0 group-hover:animate-starburstr duration-1000"
                        />
                        <Star
                            size={startSize}
                            color="cyan"
                            fill="cyan"
                            className="absolute left-1/2 opacity-0 top-0 group-hover:animate-starburstb duration-1000"
                        />
                        <Star
                            size={startSize}
                            color="cyan"
                            fill="cyan"
                            className="absolute left-1/2 opacity-0 top-0 group-hover:animate-starburstt duration-1000"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
