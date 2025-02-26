import React, { useState, useRef, useEffect } from 'react'
import Contact from '../Chatting_board_compos/Contact'
import { Pencil } from 'lucide-react'
import SearchBar from '../SearchBar'


export default function Chatslist({ Contacts,
    ContactsArchived, ContactsLocked, ContactsFavorate,
    Archived=false,Locked = false, Favorate = false,
    openChat,
    msg, msgAI, 
    messages, messagesAI ,ActivationIcon}) {
    const [NewChat, setNewChat] = useState(false);
    const componentRef = useRef(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [hoveredContact, sethoveredContact] = useState(null);

    // Handle clicks outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                setNewChat(false); // Hide component
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(()=>{
        // console.log(Archived)
        // console.log(Favorate)
        // console.log(Locked)
        // console.log(ContactsArchived)
        // console.log(ActivationIcon)
    },[])

    return (
        <div className="w-[35%] border border-gray-900 bg-gray-800 text-white">
            <div className="flex justify-between ml-3 text-center py-4">
                <div>
                    <div className="border-2 border-primary rounded-full"></div>
                    <h3 className="font-semibold text-xl">{localStorage.getItem("Fullname")} </h3>
                    <h3>My account</h3>
                </div>
                <div className='cursor-pointer mr-5 flex justify-center items-center'>
                    <div className='w-fit h-fit relative group p-3 hover:bg-gray-700 rounded-full' onClick={() => { openChat(false) }}>
                        <Pencil onClick={() => setNewChat(true)}  ></Pencil>
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 scale-0 transform bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                            New Chat
                        </span>
                        {NewChat &&
                            <div ref={componentRef} className='absolute top-3/2'>
                                <SearchBar />
                            </div>
                        }
                    </div>
                </div>
            </div>

            {(!Archived && !Locked && !Favorate) &&
                <div className="ml-3 mr-3 mt-3 overflow-hidden h-[85vh]">
                    <h3 className="font-semibold text-lg">Contacts</h3>
                    {Object.entries(Contacts).map(([key, email]) => (
                        <p
                            key={key}
                            onMouseOver={() => {
                                sethoveredContact(key);
                            }}
                            onClick={() => {
                                openChat();
                                setSelectedContact(key);
                            }}
                            className={` cursor-pointer rounded-lg transition-colors duration-200 mt-1 
                            ${selectedContact === key ? "bg-gray-600 text-white" : "bg-gray-800"} `
                            }
                        >
                            {(ContactsArchived[key] === Archived && ContactsFavorate[key] === Favorate && ContactsLocked[key] === Locked)
                                &&
                                <Contact Email={email}
                                    msg={msg} msgAI={msgAI}
                                    messages={messages} messagesAI={messagesAI}
                                archive={Archived} />
                            }
                        </p>
                    ))}
                </div>}

            {(Archived && !Locked && !Favorate)&&
                <div className="ml-3 mr-3 mt-3 overflow-hidden h-[85vh]">
                    <h3 className="font-semibold text-lg">Archived</h3>
                    {Object.entries(Contacts).map(([key, email]) => (
                        <p
                            key={key}
                            onMouseOver={() => {
                                sethoveredContact(key);
                            }}
                            onClick={() => {
                                openChat();
                                setSelectedContact(key);
                            }}
                            className={` cursor-pointer rounded-lg transition-colors duration-200 mt-1 
                            ${selectedContact === key ? "bg-gray-600 text-white" : "bg-gray-800"} `
                            }
                        >
                            {/* {console.log(ContactsArchived[key])} */}
                            {(ContactsArchived[key] === Archived && ContactsLocked[key] === Locked && ContactsFavorate[key] === Favorate )
                                &&
                                <Contact Email={email}
                                    msg={msg} msgAI={msgAI}
                                    messages={messages} messagesAI={messagesAI}
                                    archive={Archived} />
                            }
                        </p>
                    ))}
                </div>}
            {(!Archived && !Locked && Favorate)&&
                <div className="ml-3 mr-3 mt-3 overflow-hidden h-[85vh]">
                    <h3 className="font-semibold text-lg">Favorate</h3>
                    {Object.entries(Contacts).map(([key, email]) => (
                        <p
                            key={key}
                            onMouseOver={() => {
                                sethoveredContact(key);
                            }}
                            onClick={() => {
                                openChat();
                                setSelectedContact(key);
                            }}
                            className={` cursor-pointer rounded-lg transition-colors duration-200 mt-1 
                            ${selectedContact === key ? "bg-gray-600 text-white" : "bg-gray-800"} `
                            }
                        >
                            {/* {console.log(ContactsArchived[key])} */}
                            {(ContactsArchived[key] === Archived && ContactsLocked[key] === Locked && ContactsFavorate[key] === Favorate )
                                &&
                                <Contact Email={email}
                                    msg={msg} msgAI={msgAI}
                                    messages={messages} messagesAI={messagesAI}
                                    archive={Archived} />
                            }
                        </p>
                    ))}
                </div>}
            {(!Archived && Locked && !Favorate)&&
                <div className="ml-3 mr-3 mt-3 overflow-hidden h-[85vh]">
                    <h3 className="font-semibold text-lg">Locked</h3>
                    {Object.entries(Contacts).map(([key, email]) => (
                        <p
                            key={key}
                            onMouseOver={() => {
                                sethoveredContact(key);
                            }}
                            onClick={() => {
                                openChat();
                                setSelectedContact(key);
                            }}
                            className={` cursor-pointer rounded-lg transition-colors duration-200 mt-1 
                            ${selectedContact === key ? "bg-gray-600 text-white" : "bg-gray-800"} `
                            }
                        >
                            {(ContactsArchived[key] === Archived && ContactsLocked[key] === Locked && ContactsFavorate[key] === Favorate )
                                &&
                                <Contact Email={email}
                                    msg={msg} msgAI={msgAI}
                                    messages={messages} messagesAI={messagesAI}
                                    archive={Archived} />
                            }
                        </p>
                    ))}
                </div>}

        </div>
    );
}
