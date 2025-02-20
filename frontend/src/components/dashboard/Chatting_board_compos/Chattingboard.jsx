import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import ChattingboardTop from './ChattingboardTop';
import Emoji from './Emoji';
import { Sun, Smile } from "lucide-react";
import { FaPaperPlane } from 'react-icons/fa'; //react-icons/fa

export default function Chattingboard({
    sendMessage,
    setMessages,
    socket,
    setMsg,
    messages,
    call = true, video_call = true, more = true, AI = false,
    Input,
    msg,
    Avatar,
    chatting_with,
    chatting_with_state,
    setActivationIcon,
    isOpenchat, setisOpenchat, }) {
    const messagesEndRef = useRef(null);
    const [messages2, setMessages2] = useState(messages);
    const [ShowEmjies, setShowEmjies] = useState(false);
    const [contactchanges, setcontactchanges] = useState([]);
    const ref = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, messages2]);

    useEffect(() => {
        const handleclickoutside = (e) => {
            // console.log(e.target)
            if (ref.current && !ref.current.contains(e.target)) {
                setShowEmjies(false);
            }
        }
        document.addEventListener("mousedown", handleclickoutside);
        return () => {
            document.removeEventListener("mousedown", handleclickoutside);
        };
    }, [ShowEmjies])

    // const tailwindColors600 = [
    //     "gray-600", "slate-600", "stone-600", "zinc-600", "neutral-600",
    //     "red-600", "rose-600",
    //     "orange-600", "amber-600",
    //     "yellow-600", "lime-600",
    //     "green-600", "emerald-600", "teal-600",
    //     "blue-600", "sky-600", "cyan-600",
    //     "purple-600", "violet-600", "fuchsia-600", "pink-600"
    // ];
    // const [a, seta] = useState(tailwindColors600[Math.floor(Math.random() * tailwindColors600.length)])
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

    useEffect(() => {
        if(!AI){
            fetching_messages()
        }
    },[messages]);
    useEffect(() => {
        if(!AI){
            fetching_messages()
        }
    },[Avatar]);
    useEffect(() => {
        if(!AI){
            fetching_messages()
        }
    },[contactchanges]);
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
            {isOpenchat &&
                <div className=" w-full h-screen border border-gray-900 flex flex-col items-center text-center">
                    <ChattingboardTop more={more}
                        video_call={video_call}
                        Avatar={Avatar}
                        setActivationIcon={setActivationIcon}
                        chatting_with={chatting_with}
                        chatting_with_state={chatting_with_state}
                        setcontactchanges={setcontactchanges}
                        setMessages={setMessages} 
                        setMsg={setMsg}
                        call={call} />

                    <div
                        className="h-full w-full overflow-y-auto scrollbar-none"
                        style={{
                            backgroundImage: "url(https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png)",
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        }}
                    >
                        <div className="px-4 py-2 text-start">
                            {AI && Array.isArray(messages) && messages.map((messageObj, index) => (
                                <div
                                    key={index}
                                    className={`max-w-[60%] w-fit rounded-b-xl m-2 rounded-tl-xl p-2 ${messageObj?.sender === "self"
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
                                    className={`max-w-[60%] w-fit rounded-b-xl m-2 rounded-tl-xl p-2 ${messageObj?.senderid === localStorage.getItem("Email")
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
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                    <div className=" w-full bg-gray-800 text-white h-fit ">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            sendMessage();
                        }} className='flex justify-between items-center mb-1'>
                            <div className='w-full flex justify-between align-middle px-2 items-center gap-3'>
                                {!AI &&
                                    Smile && <Smile size={24} color="orange" strokeWidth={1.5} className="mr-2 cursor-pointer mt-1"
                                        onClick={() => { ShowEmjies ? setShowEmjies(false) : setShowEmjies(true); }}
                                        setMsg={setMsg} msg={msg} />
                                }
                                {ShowEmjies &&
                                    <div className='' ref={ref}>
                                        <Emoji msg={msg} setMsg={setMsg} />
                                    </div>
                                }
                                <div className='w-full'>
                                    <Input
                                        className="border-none bg-gray-800 text-white"
                                        placeholder="Type your message..."
                                        aria-label="Type your message"
                                        onChange={(e) => { setMsg(e.target.value); }}
                                        value={msg}
                                    />
                                </div>
                                <div type='submit' className=''>
                                    <FaPaperPlane size={24} color="white" strokeWidth={1.5}
                                        className='cursor-pointer mt-1' onClick={(e) => { e.preventDefault(); sendMessage(); }} />
                                </div>
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
