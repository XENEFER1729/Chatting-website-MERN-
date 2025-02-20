import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, Video, Menu, Trash2, Pin, Star, Archive, X, MessageSquare, Settings, Flag } from "lucide-react";
import VoCallSub from '../Left_second/Voicecalling/VoCallSub';

export default function ChattingboardTop({ more,
    video_call,
    Avatar,
    chatting_with,
    chatting_with_state,
    setcontactchanges,
    setActivationIcon,
    setMessages, setMsg,
    call }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [Vcall, setVcall] = useState(null)
    const ref=useRef(null)

    // Effect to handle clicks outside the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
            if (ref.current && !ref.current.contains(event.target)) {
                setVcall(null);
            }

        }

        // Add event listener if a dropdown is open
        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        if (Vcall) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown,Vcall]);

    

    const toggleDropdown = (dropdown) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
        }
    };
    const clearChat = async () => {
        try {
            const response = await fetch("http://localhost:9000/api/clearChat", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user1: localStorage.getItem("Email"),
                    user2: localStorage.getItem("receiver_Email"),
                })
            });
            const data = await response.json();
            setcontactchanges((prev) => !prev);
            setMessages((prev) => !prev);
            setMsg((prev) => !prev);
        } catch (error) {
            console.log();
        }
    }

    const handleAction = async (action) => {
        console.log(`Selected action: ${action}`);
        setOpenDropdown(null);
        if (action === "clear") {
            clearChat()
        }
        if (action === "voice-call" || action === "schedule-call") {
            // setActivationIcon("calls")
            setVcall(true)
        }
        if (action === "start-video-call" || action === "schedule-video") {
            setActivationIcon("calls")
        }
    };

    return (
        <div className="w-full h-[80px] flex justify-between p-2 bg-gray-800 text-white">
            <div className="flex justify-center items-center">
                <div className=''>
                    <img src={`${Avatar}`} alt="user avatar" className="cursor-pointer border rounded-full" width={48} height={48} />
                </div>
                <div className='flex flex-col justify-start text-start'>
                    <h1 className="ml-3 text-xl mt-[-5px] cursor-default"> {chatting_with} </h1>
                    <h1 className="text-gray-300 ml-3">{chatting_with_state}</h1>
                </div>
            </div>
            {Vcall &&
                <div ref={ref}>
                    <VoCallSub />
                </div>}
            <div className='flex gap-4 justify-center align-middle items-center' ref={dropdownRef}>
                {call &&
                    <div className="relative group">
                        <div
                            onClick={() => toggleDropdown('call')}
                            className="hover:bg-gray-700 rounded-full p-2 cursor-pointer"
                        >
                            <PhoneCall size={24} className="m-1" />

                            {/* Tooltip */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:flex 
                                bg-gray-700 text-white text-sm p-1 rounded-sm whitespace-nowrap z-20">
                                Call
                            </span>
                        </div>

                        {/* Call Dropdown */}
                        {openDropdown === 'call' && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleAction('voice-call')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <PhoneCall className="mr-2 h-4 w-4" />
                                        Voice call
                                    </button>
                                    <button
                                        onClick={() => handleAction('schedule-call')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Schedule a call
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                }

                {video_call &&
                    <div className="relative group">
                        <div
                            onClick={() => toggleDropdown('video')}
                            className="hover:bg-gray-700 rounded-full p-2 cursor-pointer"
                        >
                            <Video size={24} className="m-1" />

                            {/* Tooltip */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:flex 
                                bg-gray-700 text-white text-sm p-1 rounded-sm whitespace-nowrap z-20">
                                Video call
                            </span>
                        </div>

                        {/* Video Call Dropdown */}
                        {openDropdown === 'video' && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleAction('start-video-call')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <Video className="mr-2 h-4 w-4" />
                                        Start video call
                                    </button>
                                    <button
                                        onClick={() => handleAction('schedule-video')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Schedule video meeting
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                }

                {more &&
                    <div className="relative group">
                        <div
                            onClick={() => toggleDropdown('more')}
                            className="hover:bg-gray-700 rounded-full p-2 cursor-pointer"
                        >
                            <Menu size={24} className="m-1" />

                            {/* Tooltip */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:flex 
                                bg-gray-700 text-white text-sm p-1 rounded-sm whitespace-nowrap z-20">
                                More
                            </span>
                        </div>

                        {/* More Options Dropdown */}
                        {openDropdown === 'more' && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleAction('clear')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Clear chat
                                    </button>
                                    {/* <button
                                        onClick={() => handleAction('pin')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <Pin className="mr-2 h-4 w-4" />
                                        Pin chat
                                    </button> */}
                                    <button
                                        onClick={() => handleAction('favorite')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <Star className="mr-2 h-4 w-4" />
                                        Add to favorites
                                    </button>
                                    <button
                                        onClick={() => handleAction('settings')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Chat settings
                                    </button>
                                    {/* <button
                                        onClick={() => handleAction('report')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <Flag className="mr-2 h-4 w-4" />
                                        Report
                                    </button> */}
                                    <button
                                        onClick={() => handleAction('delete')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete conversation
                                    </button>
                                    <button
                                        onClick={() => handleAction('archive')}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archive
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}