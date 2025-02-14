import React, { useEffect, useState } from 'react';

export default function Contact({ Fullname,Username,Avatar, Email, Lastmsg = true}) {
  const [rFullname, setrFullname] = useState(Fullname || "Loading...");
  const [rUsername, setrUsername] = useState(Username || "Loading...");
  const [rLastMessage, setLastMessage] = useState("");
  const [rLastMessageSender, setLastMessagesender] = useState("");
  const [rLastMessageTimestamp, setLastMessageTimestamp] = useState("");
  const [rAvatar, setrAvatar] = useState(Avatar || "...");

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
            user2: localStorage.getItem("receiver_Email")
          })
        });
        const data = await response.json();
        setLastMessage(data["message"].message)
        setLastMessageTimestamp(data["message"].timestamp)
        setLastMessagesender(data["senderUsername"])
      } catch (error) {
        setLastMessage("no message");
      }
    };
    if (!rLastMessage) {
      getlastMessage()
    }

    // Only fetch if Fullname is not provided
    if (!Fullname) {
      getfullname();
    }
  }, [Fullname, Email, rLastMessage, rAvatar]);


  return (
    <div
      onClick={() => {
        localStorage.setItem("receiver_Email", Email);
        localStorage.setItem("receiver_Fullname", Fullname || rFullname);
      }}
      className="p-3 rounded-lg flex items-center gap-3 transition duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500"
    >
      <img
        className="rounded-full w-12 h-12 object-cover"
        src={rAvatar}
        alt="Profile"
      />

      {/* Message Info Section */}
      <div className="flex flex-col w-full">
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
        {Lastmsg &&
          <span className="text-sm text-gray-400 truncate">{rLastMessageSender === localStorage.getItem("Username") ? "You" : rLastMessageSender}
           {rLastMessage==="no message"?"":": "}
           {rLastMessage}</span>
        }
      </div>
    </div>

  );
}
