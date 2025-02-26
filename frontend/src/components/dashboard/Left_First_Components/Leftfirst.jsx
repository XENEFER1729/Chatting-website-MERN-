import React from 'react'
import {
    Settings,
    Lock,
    Archive,
    MessageSquare,
    Phone,
    Circle,
    Star
} from 'lucide-react';

export default function Leftfirst({ ActivationIcon, setActivationIcon, setisOpenchat }) {

    return (
        <div className="flex h-screen ">
            {/* Left Icons Bar */}
            <div className="w-16 bg-gray-900 flex flex-col items-center py-6 space-y-6">
                {/* {console.log(ActivationIcon)} */}
                <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === 'chats' ? 'text-green-500' : ""}`}
                    onClick={() => { setActivationIcon("chats"); setisOpenchat(false) }} >
                    <MessageSquare size={24} />
                </button>
                {/* <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === "calls" ? "text-green-500" : ""} `}
                    onClick={() => setActivationIcon("calls")}>
                    <Phone size={24} />
                </button> */}
                <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === "chatbot" ? "text-green-500" : ""} `}
                    onClick={() => { setActivationIcon("chatbot"); setisOpenchat(true) }}>
                    <Circle size={24} className="text-blue-500" />
                </button>
                <div className="flex-grow" />
                <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === "favorate" ? "text-green-500" : ""} `}
                    onClick={() => { setActivationIcon("favorate"); setisOpenchat(false) }}>
                    <Star size={24} className="" />
                </button>
                <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === "archive" ? "text-green-500" : ""} `}
                    onClick={() => { setActivationIcon("archive"); setisOpenchat(false) }}>
                    <Archive size={24} />
                </button>
                <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === "locked" ? "text-green-500" : ""} `}
                    onClick={() => { setActivationIcon("lockedCompo"); setisOpenchat(false) }}>
                    <Lock size={24} />
                </button>
                <button className={`text-gray-400 hover:text-green-500 ${ActivationIcon === "settings" ? "text-green-500" : ""} `}
                    onClick={() => { setActivationIcon("settings"); setisOpenchat(false) }}>
                    <Settings size={24} />
                </button>
            </div>
        </div>
    );
}
