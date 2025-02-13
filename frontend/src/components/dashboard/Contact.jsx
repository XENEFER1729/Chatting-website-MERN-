import React, { useEffect, useState } from 'react';

export default function Contact({ Fullname, Email}) {
  const [rFullname, setrFullname] = useState(Fullname || "Loading...");
  const [rLastMessage,setLastMessage]=useState("");
  const [rAvatar,setrAvatar]=useState("");

  // Save receiver's details in localStorage
  useEffect(() => {
    localStorage.setItem("receiver_Fullname", rFullname);
    localStorage.setItem("receiver_Email", Email);
  }, [rFullname, Email]);

  // Fetch full name if not provided
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
          if (user?.user?.email === Email) {
            setrFullname(user.user.Fullname);
            setrAvatar(user.user.avatar)
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching full name:", error);
        setrFullname("Name not found");
      }
    };
    const getlastMessage = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/getConversations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const a = localStorage.getItem("Email")
        for (let i in data) {
          console.log("hi",data[i].members)
          const b=data[i].members
          if(b.includes(localStorage.getItem("Email")) && b.includes(localStorage.getItem("receiver_Email") )){
            setLastMessage(data[i].LastMessage)
          }
        }
      } catch (error) {
        setLastMessage("no message");
      }
    };
    if(!rLastMessage){
      getlastMessage()
    }

    // Only fetch if Fullname is not provided
    if (!Fullname) {
      getfullname();
    }
  }, [Fullname, Email,rLastMessage,rAvatar]);


  return (
    <div onClick={() => {
      localStorage.setItem("receiver_Email", Email);
      localStorage.setItem("receiver_Fullname", Fullname ? Fullname : rFullname)
    }}
      className={`rounded-lg p-2 mt-1 flex overflow-hidden gap-2 transition duration-200 bg-gray-800 hover:bg-gray-600 cursor-pointer`}>
      <div>
        <img
          className="rounded-full h-12"
          src={`${rAvatar}`}
          alt="Profile"
        />
      </div>
      <div className='flex flex-col text-start' >
        <p className="font-serif text-[20px]">{rFullname}</p>
        {/* <p className="font-normal">{Email}</p> */}
        <p className="font-normal">{rLastMessage}</p>
      </div>
    </div>
  );
}
