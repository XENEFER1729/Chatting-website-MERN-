import React, { useEffect, useState } from 'react';
import { Archive } from 'lucide-react'

export default function Contact({ Fullname,
  Username,
  archive = false,
  locked = false,
  favorate=false,
  Avatar,
  Email,
  Lastmsg = true,
  msgAI, msg,
  messages, messageAI, }) {
  const [rFullname, setrFullname] = useState(Fullname || "Loading...");
  const [rUsername, setrUsername] = useState(Username || "Loading...");
  const [rLastMessage, setLastMessage] = useState("");
  const [rLastMessageSender, setLastMessagesender] = useState("");
  const [rLastMessageTimestamp, setLastMessageTimestamp] = useState("");
  const [rAvatar, setrAvatar] = useState(Avatar || "...");
  const [rMsgRead, setrMsgRead] = useState(false);

  // Save receiver's details in localStorage
  useEffect(() => {
    localStorage.setItem("receiver_Fullname", rFullname);
    localStorage.setItem("receiver_Email", Email);
  }, [rFullname, Email]);
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
          setrUsername(user.user.Username);
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
      const response = await fetch("http://localhost:9000/api/getLastMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: localStorage.getItem("Email"),
          user2: Email
        })
      });
      const data = await response.json();
      setLastMessage(data["message"].message)
      setLastMessageTimestamp(data["message"].timestamp)
      // setrMsgRead(data["message"].msgRead)
      setLastMessagesender(data.senderUsername)
      if (data["message"].msgRead === "yes") { setrMsgRead(true) }
      else { setrMsgRead(false); }
    } catch (error) {
      setLastMessage("no message");
    }
  };
  useEffect(() => {
    getlastMessage();
  }, [msg])
  useEffect(() => {
    getlastMessage();
  }, [msgAI])
  useEffect(() => {
    getlastMessage();
  }, [messages])
  useEffect(() => {
    getlastMessage();
  }, [messageAI])

  const removeUnread = async (a) => {
    try {
      const response = await fetch("http://localhost:9000/api/UpdateMsgRead", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: localStorage.getItem("Email"),
          user2: localStorage.getItem("receiver_Email"),
          read: a
        })
      });
      const data = await response.json();
      for (let i in data["message2"]) {
        // console.log(data["message2"][i]["msgRead"])
        if (data["message2"][i]["msgRead"] === "yes") { setrMsgRead(true) }
        else { setrMsgRead(false); }
      }
    } catch (error) {
      console.log();
    }
  }

  useEffect(() => {
    if (!Fullname) {
      getfullname();
    }
  }, [Fullname, Email, rLastMessage, rAvatar]);

  useEffect(() => {
    if (!rLastMessage) {
      getlastMessage()
    }
    // if (OnLastMessageSent) {
    //   console.log("setting last msg 2")
    //   getlastMessage()
    // }
    // setOnLastMessageSent(false);
  }, [rLastMessage]);

  return (
    <div
      onClick={() => {
        localStorage.setItem("receiver_Email", Email);
        localStorage.setItem("receiver_Fullname", Fullname || rFullname);
        removeUnread("yes");
      }}
      className="p-3 rounded-lg flex items-center gap-3 transition duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500"
    >
      <img
        className="rounded-full w-12 h-12 object-cover"
        src={rAvatar}
        alt="Profile"
      />

      {/* Message Info Section */}
      <div className="flex flex-col items-center justify-center w-full h-fit ">
        <div className="flex justify-between items-center w-full">
          <p className="font-semibold text-lg">{rUsername}</p>
          {Lastmsg &&
            <p className="text-sm text-gray-400">
              {new Date(rLastMessageTimestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          }
        </div>
        <div className='flex justify-between items-center w-full'>
          {Lastmsg &&
            <div className="text-sm text-gray-400 max-w-[70%] ">
              {rLastMessageSender === localStorage.getItem("Username") ? "You" : rLastMessageSender.slice(0, 10)}
              {rLastMessage === "no message" ? "" : ": "}
              {rLastMessage.slice(0, 10)}
            </div>
          }
          {(!rMsgRead && rLastMessageSender !== localStorage.getItem("Username"))
            && <div className='h-3 w-3 bg-green-500 rounded-lg '></div>}
          {archive &&
            <div>
              <Archive className="w-4 h-4" />
            </div>
          }
        </div>
      </div>
    </div>

  );
}
