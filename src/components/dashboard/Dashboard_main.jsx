import React, { useEffect, useState } from 'react';
import Input from '../form/Input';
import axios from 'axios';
import io from 'socket.io-client';
import Chatting_board from './Chatting_board';
import Left_first from './Left_First_Components/Left_first';
import Chats_list from './Left_second/Chats_list';
import Settings_main from "./Left_second/settings/Settings_main"

// Connecting to the backend server
const socket = io("http://localhost:9000");

socket.emit("register",localStorage.getItem("Email"));

export default function Dashboard_main() {
  //email,fullname
  const [Fullname, setFullname] = useState(localStorage.getItem("Fullname"))

  const [allUsers, setAllUsers] = useState([]);

  //left first components
  const [ActivationIcon, setActivationIcon] = useState("chats")


  //room
  const [chatting_with, set_chatting_with] = useState("name")
  const [chatting_with_state, set_chatting_with_state] = useState("active")
  const [Contacts, setContacts] = useState("")

  //messages
  const [isOpenchat, setisOpenchat] = useState(false)
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  //avatar
  const [Avatar, setAvatar] = useState("");
  const [Avatars, setAvatars] = useState([]);

  // Fetch all users and listen to messages
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:9000/api/allusers");
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("receiveone2one", ({ sender, message, senderid }) => {
      console.log(`Message from ${sender}: ${message} from: ${senderid}`)
      setMessages((prevMessages) => [...prevMessages, { message: message, sender: "other" }]);
      setMsg('');
    });

    // Clean up the socket event listener
    return () => {
      socket.off("receiveone2one");
    };
  }, []);

  const sendMessage = () => {
    // console.log("sending msg :", msg, "to :", localStorage.getItem("receiver_Email"))
    socket.emit('sendone2oneMSG', { senderid: localStorage.getItem("Email"), receiverid: localStorage.getItem("receiver_Email"), message: msg });
    setMessages((prevMessages) => [...prevMessages, { message: msg, sender: "self" }]);
    setMsg('');

  };
  const handleAvatar = (e) => {
    const ava = e.target.files[0];
    try {
      const ava2 = URL.createObjectURL(ava);
      // console.log(ava)
      setAvatar(ava2);
      setAvatars((prevItems) => [...prevItems, ava2])
      console.log(Avatars)
    } catch (error) {
      console.log(error)
    }
    console.log("handle avatar");
    // setAvatar("https://imgs.search.brave.com/GHQkBlu8Dy9-gL8XpPnU2YECbiRcpK-k8MnY2HJFDzw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODE4/MDIxMTgvcGhvdG8v/Y2xvc2V1cC1vZi1p/bWctZm91bmRlci1h/bmQtY2VvLW1hcmst/bWNjb3JtYWNrLWxp/Z29uaWVyLXBhLTgt/MTQtMTk2NS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9YUNj/ZExpNjE4b19qSjNC/WjN4VTZyZGN6T25n/NmxmVXZHZlhIUVRx/RC1YST0")
  }
  useEffect(() => {
    const fetchdata = async () => {
      const Contact = {}
      const contactsfetch = await fetch("http://localhost:9000/api/getConversations", {
        method: "GET",
        headers: {
          "Context-type": "application/json",
        }
      })
      const data = await contactsfetch.json()
      const a = localStorage.getItem("Email")
      for (let i in data) {
        // console.log(data[i]["members"])
        if (data[i]["members"][0] == a) {
          Contact[i] = data[i]["members"][1]
        }
        if (data[i]["members"][1] == a) {
          Contact[i] = data[i]["members"][0]
        }
      }
      setContacts(Contact)
      // console.log(Contacts)

    }
    fetchdata()
  })
  const openChat = () => {
    console.log("opening the chat box")
    setisOpenchat(true)
    set_chatting_with(localStorage.getItem("receiver_Fullname"))

  }

  return (
    <div className="w-screen h-screen flex  ">
      <Left_first setActivationIcon={setActivationIcon} ActivationIcon={ActivationIcon} />
      {ActivationIcon === "chats" && <Chats_list Contacts={Contacts} 
        openChat={openChat} handleAvatar={handleAvatar}
        Avatar={Avatar} />}

      {/* Main Chat Area */}
      {ActivationIcon === "chats" && <Chatting_board sendMessage={sendMessage}
        setMsg={setMsg}
        messages={messages}
        Input={Input}
        msg={msg}
        chatting_with={chatting_with}
        chatting_with_state={chatting_with_state}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}
      {ActivationIcon === "settings" && <Settings_main/>}
      
    </div>
  );
}
