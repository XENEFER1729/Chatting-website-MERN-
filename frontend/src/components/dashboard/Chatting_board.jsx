import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { PhoneCall } from "lucide-react";
import { Menu } from "lucide-react";
import { Video } from "lucide-react";
import { Sun } from "lucide-react";

export default function Chatting_board({
    sendMessage,
    setMsg,
    messages,
    call = true, video_call = true, more = true, AI = false,
    Input,
    msg,
    Avatar,
    chatting_with,
    chatting_with_state,
    isOpenchat, setisOpenchat }) {
    const messagesEndRef = useRef(null);
    const [messages2, setMessages2] = useState([])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, messages2]);

    const tailwindColors600 = [
        "gray-600", "slate-600", "stone-600", "zinc-600", "neutral-600",
        "red-600", "rose-600",
        "orange-600", "amber-600",
        "yellow-600", "lime-600",
        "green-600", "emerald-600", "teal-600",
        "blue-600", "sky-600", "cyan-600",
        "purple-600", "violet-600", "fuchsia-600", "pink-600"
    ];
    const [a, seta] = useState(tailwindColors600[Math.floor(Math.random() * tailwindColors600.length)])
    useEffect(() => {
        const fetching_messages = async () => {
            const getMessages = await fetch("http://localhost:9000/api/getmessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ senderid: localStorage.getItem("Email"), receiverid: localStorage.getItem("receiver_Email") }),
                // body: JSON.stringify({ senderid: localStorage.getItem("receiver_Email") , receiverid: localStorage.getItem("Email") })
            })
            const data = await getMessages.json()
            // console.log(data)
            setMessages2(data)
            // console.log(messages2)
        }
        if (!AI) {
            fetching_messages()
        }

    })
    const formatMessage = (text) => {
        if (!text) return [];
        // Split by common sentence endings (., !, ?) but keep the punctuation
        // Also handle multiple consecutive punctuation marks
        const sentences = text.split(/([***]+\s+)/).filter(Boolean);

        return sentences.map((sentence, index) => (
            <span key={index} className="block">
                {sentence.trim()}
            </span>
        ));
    };




    return (

        <div className='w-[100%] '>
            {isOpenchat && <div className=" w-full h-screen border border-gray-900 flex flex-col items-center text-center">
                <div className=" w-full h-[80px] flex justify-between p-2 bg-gray-800 text-white ">
                    <div className="flex justify-center items-center">
                        <div className=''>
                            <img src={`${Avatar}`} alt="user avatar" className="cursor-pointer border rounded-full" width={48} height={48} />
                        </div>
                        <div className='flex flex-col justify-start text-start'>
                            <h1 className="ml-3 text-xl mt-[-5px] cursor-default " > {chatting_with} </h1>
                            <h1 className="text-gray-300 ml-3">{chatting_with_state}</h1>
                        </div>
                    </div>
                    <div className='flex gap-4 justify-center align-middle items-center'>
                        {call && <div className="relative group hover:bg-gray-700 rounded-full p-2 cursor-pointer">
                            <PhoneCall size={24} className="m-1" />

                            {/* Tooltip (Hidden by default, shown on hover) */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:flex 
                   bg-gray-700 text-white text-sm p-1 rounded-sm whitespace-nowrap">
                                Call
                            </span>
                        </div>}
                        {video_call && <div className="relative group hover:bg-gray-700 rounded-full p-2 cursor-pointer">
                            <Video size={24} className="m-1" />

                            {/* Tooltip (Hidden by default, shown on hover) */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:flex 
                   bg-gray-700 text-white text-sm p-1 rounded-sm whitespace-nowrap">
                                Video call
                            </span>
                        </div>}
                        {more && <div className="relative group hover:bg-gray-700 rounded-full p-2 cursor-pointer">
                            <Menu size={24} className="m-1" />

                            {/* Tooltip (Hidden by default, shown on hover) */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:flex 
                   bg-gray-700 text-white text-sm p-1 rounded-sm whitespace-nowrap">
                                More
                            </span>
                        </div>}

                    </div>

                </div>

                <div
                    className="h-full w-full overflow-y-auto scrollbar-none"
                    style={{
                        backgroundImage: "url(https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png)",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                    }}
                >
                    <div className="px-10 py-14 text-start">
                        {AI && Array.isArray(messages) && messages.map((messageObj, index) => (
                            <div
                                key={index}
                                className={`max-w-[60%] w-fit rounded-b-xl m-1 rounded-tr-xl p-2 ${messageObj?.sender === "self"
                                    ? "bg-green-600 ml-auto text-white"
                                    : "text-white bg-gray-800"
                                    }`}
                            >
                                <h1 className="font-semibold">
                                    {messageObj?.sender !== "self" ? "AI chatbot" : ""}
                                </h1>
                                <div className="flex gap-1">
                                    <div className="message-content">
                                        {formatMessage(messageObj?.message)}
                                    </div>
                                    <span className="text-gray-400 text-xs self-end mt-1">
                                        {new Date().toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {!AI && Array.isArray(messages2) && messages2.map((messageObj, index) => (
                            <div
                                key={index}
                                className={`max-w-[60%] w-fit rounded-b-xl m-1 rounded-tr-xl p-2 ${messageObj?.senderid === localStorage.getItem("Email")
                                    ? "bg-green-700 ml-auto text-white"
                                    : "text-white bg-gray-800"
                                    }`}
                            >
                                <div className='flex gap-1'>
                                    <span className="text-white block">{messageObj?.message}</span>
                                    <span className="text-gray-400 text-xs self-center">
                                        {messageObj?.timestamp ?
                                            new Date(messageObj.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : ''
                                        }
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className=" w-full bg-gray-800 text-white ">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage();
                    }} className='flex justify-between items-center align-middle mb-2'>
                        {!AI && <div className='w-fit bg-black mr-4 text-white'>Emojis</div>}
                        <div className='w-full'>
                            <Input
                                className=" border-none w-full bg-gray-800 text-white"
                                placeholder="Type your message..."
                                aria-label="Type your message"
                                onChange={(e) => { setMsg(e.target.value); }}
                                value={msg}
                            />
                        </div>
                        <div type='submit' className=''>
                            <button className="p-2 bg-green-700 rounded-sm">
                                Send
                            </button>
                        </div>
                    </form>
                </div>

            </div>}
            {!isOpenchat &&
                <div className=" w-full h-screen border border-gray-900 bg-gray-800 flex flex-col gap-5 justify-center items-center text-center">
                    <Sun size={64} color="orange" strokeWidth={1.5} className="mr-2" />
                    <p className='text-7xl text-gray-300'>Chat App</p>
                    <p className='text-gray-500'> send and receive messages </p>
                </div>}
        </div>

    )
}
