import React from "react";

const CustomToggle = ({ isActive, onToggle, children }) => (
    <div
        onClick={onToggle}
        className={`
      flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer
      transition-colors duration-200 select-none 
      ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
      hover:bg-opacity-80
    `}
    >
        {children}
        <span className={`
      text-sm font-medium ml-2
      ${isActive ? 'text-green-700' : 'text-gray-500'}
    `}>
            {isActive ? 'ON' : 'OFF'}
        </span>
    </div>
);

export default CustomToggle