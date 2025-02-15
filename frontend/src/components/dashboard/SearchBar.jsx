import React, { useState } from "react";
import Contact from "./Chatting_board_compos/Contact";

export default function SearchBar() {
    const [Con, setCon] = useState([]); // Stores filtered contacts
    const [Avatar, setAvatar] = useState([]); // Stores filtered contacts

    // Fetch all users and filter based on input
    const handleOnChange = async (e) => {
        const searchTerm = e.target.value;
        if (searchTerm.trim().length === 0) {
            setCon([]); // Clear results if input is empty
            return; 
        }

        try {
            const response = await fetch("http://localhost:9000/api/allusers", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

          

            const data = await response.json();
            const filteredContacts = data
                .filter((item) =>
                    item.user.Fullname.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => ({
                    Fullname: item.user.Fullname,
                    Email: item.user.email,
                    Avatar:item.user.avatar,
                    Username:item.user.Username
                }));

            setCon(filteredContacts); // Update state with filtered contacts
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Create a conversation
    const Establish_conversation = async (email) => {
        const senderEmail = localStorage.getItem("Email");
        if (!senderEmail || !email || senderEmail === email) {
            console.error("Cannot create conversation with the same email or missing data.");
            return;
        }
        try {
            const response = await fetch("http://localhost:9000/api/createConversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Fixed header key
                },
                body: JSON.stringify({
                    senderid: senderEmail,
                    receiverid: email,
                }),
            });

            if (!response.ok) {
                console.error("Failed to create conversation");
                return;
            }

            const result = await response.json();
              console.log("Conversation created:", result);
            // setCon("")
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    };
    const remove_all_options=()=>{
        // console.log("remove all options")
        setCon(" ")
    }

    return (
        <div className="mt-2 bg-gray-800 rounded-lg p-2">
            <h1 className="flex justify-start pb-2 text-2xl">New Chat</h1>
            <div className="flex justify-center items-center gap-1 min-w-80 ">
                {/* <div className="hover:bg-gray-300 cursor-pointer rounded-full">
                    <ArrowLeft className="w-5 h-5 m-2" onClick={remove_all_options} />
                </div> */}
                <input
                    type="text"
                    placeholder="Enter Name"
                    onChange={handleOnChange}
                    className="w-full bg-gray-500 border rounded-lg p-1"
                />
            </div>
            {Con.map((element) => (
                <div
                    key={element.Email} // Use a unique key for React
                    onClick={() => Establish_conversation(element.Email)} // Pass email to the handler
                    className="cursor-pointer hover:bg-gray-100 mt-2 rounded-md"
                >
                    <Contact Fullname={element.Fullname} Username={element.Username} Avatar={element.Avatar} Email={element.Email} Lastmsg={false} />
                </div>
            ))}
        </div>
    );
}
