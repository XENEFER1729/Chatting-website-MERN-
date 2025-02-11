import React from "react";
import { Bell, Moon, Volume2, Shield, Lock, User, Globe, Palette, Camera, Mail, Phone, Edit2, Check, X, CloudFog } from 'lucide-react';
import { useRef } from 'react';
import { stringify } from 'uuid';
import CustomSelect from './CustomSelect';


const CustomButton = ({ variant = 'default', size = 'default', onClick, children }) => {
    const variants = {
        default: 'bg-green-500 hover:bg-green-600 text-white',
        outline: 'border-2 border-gray-300 hover:border-gray-400 ',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    const sizes = {
        default: 'px-4 py-2',
        sm: 'px-3 py-1 text-sm',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            onClick={onClick}
            className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium
        transition-all duration-200
        flex items-center justify-center gap-2
      `}
        >
            {children}
        </button>
    );
};

export default CustomButton