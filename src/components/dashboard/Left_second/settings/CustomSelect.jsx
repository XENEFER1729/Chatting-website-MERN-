import React, { useEffect, useState } from 'react';
import { Bell, Moon, Volume2, Shield, Lock, User, Globe, Palette, Camera, Mail, Phone, Edit2, Check, X, CloudFog } from 'lucide-react';
import { useRef } from 'react';
import { stringify } from 'uuid';

const CustomSelect = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={onChange}
        className="
      px-4 py-2 rounded-lg
      border-2 border-gray-600
      cursor-pointer
      text-black
      hover:border-gray-500
      focus:outline-none focus:border-green-500
      transition-colors duration-200
    "
    >
        {options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

export default CustomSelect