import React, { useState,useRef,useEffect } from 'react'
import Contact_single from '../Contact_single'
import Contact from '../Contact'
import { Pencil } from 'lucide-react'
import SearchBar from '../SearchBar'

export default function Chats_list({ Contacts, openChat, handleAvatar, Avatar }) {
    const [NewChat, setNewChat] = useState(false);
    const componentRef = useRef(null);

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
    return (
        <div className="w-[30%] border border-gray-900 bg-gray-800 text-white">
            <div className="flex justify-between ml-3 text-center py-4">
                <div>
                    <div className="border-2 border-primary rounded-full"></div>
                    <h3 className="font-semibold text-xl">{localStorage.getItem("Fullname")} </h3>
                    <h3>My account</h3>
                </div>
                <div className='cursor-pointer mr-5 flex justify-center items-center'>
                    <div className='w-fit h-fit relative group p-3 hover:bg-gray-700 rounded-full'>
                        <Pencil onClick={() => setNewChat(true)} ></Pencil>
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 scale-0 transform bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                            NewChat
                        </span>
                        {NewChat &&
                            <div ref={componentRef} className='absolute top-3/2'>
                                <SearchBar  />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="ml-3 mr-3 mt-3 overflow-hidden h-[85vh]">
                <h3 >Contacts and Groups</h3>
                {Object.entries(Contacts).map(([key, email]) => (
                    <p key={key} onClick={openChat}>
                        <Contact Email={email} ></Contact>
                    </p>
                ))}
                
            </div>
        </div>
    )
}
