import React, { useEffect } from 'react'
import { useState } from 'react';
import { PhoneCall } from "lucide-react";
import { Menu } from "lucide-react";
import { Video } from "lucide-react";
import { Sun } from "lucide-react";

export default function Chatting_board({
    sendMessage,
    setMsg,
    messages,
    Input,
    msg,
    chatting_with,
    chatting_with_state,
    isOpenchat, setisOpenchat }) {
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
    const [messages2, setMessages2] = useState([])
    const [Avatar, setAvatar] = useState("")
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
        fetching_messages()

    })
    useEffect(() => {
        const getfullname = async () => {
            try {
                const response = await fetch("http://localhost:9000/api/allusers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                // Find user by email and update the full name
                for (const user of data) {
                    if (user?.user?.email === localStorage.getItem("receiver_Email")) {
                        setAvatar(user.user.avatar)
                        break;
                    }
                }
            } catch (error) {
                console.error("Error fetching full name:", error);
            }
        };
        if (!Avatar) {
            getfullname();
          }

    },[Avatar])



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
                        <div className='hover:bg-gray-200 rounded-full p-1 cursor-pointer '>
                            <PhoneCall size={24} className="text-white hover:text-gray-900 hover:bg-gray-200 m-1 " />
                        </div>
                        <div className='hover:bg-gray-200 rounded-full p-1 cursor-pointer'>
                            <Video size={24} className="text-white hover:text-gray-900 hover:bg-gray-200 m-1 " />
                        </div>
                        <div className='hover:bg-gray-200 rounded-full p-1 cursor-pointer'>
                            <Menu size={24} className="text-white hover:text-gray-900 hover:bg-gray-200 m-1 " />
                        </div>
                    </div>

                </div>

                <div className=" h-full w-[100%] overflow-auto  overflow-x-hidden"
                    style={{
                        backgroundImage: "url(https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png)",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                    }}>
                    <div className=" px-10 py-14 text-start">
                        {/* {messages.map((messageObj, index) => (
                            <div
                                key={index}
                                className={`max-w-[60%] w-fit rounded-b-xl m-1 rounded-tr-xl p-2 ${messageObj.sender === "self" ? "bg-green-600 ml-auto text-white" : "text-white bg-gray-800"}`}>
                                <h1 className={`'text-${a} font-semibold`}>{messageObj.sender !== "self" ? localStorage.getItem("receiver_Fullname") : ""}</h1>
                                <span className='' > {messageObj.message}  </span>
                                <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                        ))} */}
                        {messages2.map((messageObj, index) => (

                            <div
                                key={index}
                                className={`max-w-[60%] w-fit rounded-b-xl m-1 rounded-tr-xl p-2 ${messageObj.senderid === localStorage.getItem("Email") ? "bg-green-700 ml-auto text-white" : "text-white bg-gray-800"}`}>
                                {/* <h1 className={`'text-${a} font-semibold`}>{messageObj.receiverid ===localStorage.getItem("receiver_Email") ? localStorage.getItem("receiver_Fullname") :"" }</h1> */}
                                <span className='text-white' >{messageObj.message} </span>
                                <span className='text-gray-400 text-[10px]'>
                                    {new Date(messageObj.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}

                    </div>
                </div>
                <div className=" w-full bg-gray-800 text-white ">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage();
                    }} className='flex justify-between items-center align-middle mb-2'>
                        <div className='w-fit bg-black mr-4 text-white'>Emojis</div>
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
