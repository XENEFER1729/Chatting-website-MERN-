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

socket.emit("register", localStorage.getItem("Email"));

export default function Dashboard_main() {
  //email,fullname
  const [Fullname, setFullname] = useState(localStorage.getItem("Fullname"))
  const [APIkey, setAPIkey] = useState("AIzaSyAp5UV716sRIMyScZSdWSmlvGRt6uMipEw")
  const API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${APIkey}`

  const [allUsers, setAllUsers] = useState([]);
  const [Avatar, setAvatar] = useState([]);
  const [AvatarAI, setAvatarAI] = useState("https://img.freepik.com/premium-photo/avatar-icon_665280-58322.jpg");

  //left first components
  const [ActivationIcon, setActivationIcon] = useState("chats")


  //room
  const [chatting_with, set_chatting_with] = useState("AI chatbot")
  const [chatting_with_state, set_chatting_with_state] = useState("active")
  const [Contacts, setContacts] = useState("")

  //messages
  const [isOpenchat, setisOpenchat] = useState(false)
  const [msg, setMsg] = useState('');
  const [msgAI, setMsgAI] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesAI, setMessagesAI] = useState([]);

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
  const getAvatar = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/allusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

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


  const openChat = (a = true, avatar = "") => {
    // console.log("opening the chat box")
    setisOpenchat(a)
    set_chatting_with(localStorage.getItem("receiver_Fullname"))
    getAvatar();
  }
  const sendMessageAI = async() => {
    setMessagesAI((prevMessages) => [...prevMessages, { message: msgAI, sender: "self" }]);

    try{
      const datafetch=await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "contents": [{
            "parts": [{ "text": msgAI }]
          }]
        })
      })
      const data=await datafetch.json()
      // console.log(data.candidates[0].content.parts[0].text)
      setMessagesAI((prevMessages) => [...prevMessages, { message: data.candidates[0].content.parts[0].text, sender: "other" }]);
    }catch(error){
      console.log("error in fetching ai questions: ",error)
    }

    setMsgAI('');

  }

  return (
    <div className="w-screen h-screen flex  ">
      <Left_first setActivationIcon={setActivationIcon}
        ActivationIcon={ActivationIcon}
        setisOpenchat={setisOpenchat} />
      {ActivationIcon === "chats" && <Chats_list Contacts={Contacts}
        openChat={openChat} />}

      {/* Main Chat Area */}
      {ActivationIcon === "chats" && <Chatting_board sendMessage={sendMessage}
        setMsg={setMsg}
        messages={messages}
        Input={Input}
        msg={msg}
        Avatar={Avatar}
        chatting_with={chatting_with}
        chatting_with_state={chatting_with_state}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}
      {ActivationIcon === "chatbot" && <Chatting_board sendMessage={sendMessageAI}
        setMsg={setMsgAI}
        messages={messagesAI}
        Input={Input}
        msg={msgAI}
        AI={true}
        Avatar={AvatarAI}
        chatting_with={chatting_with}
        chatting_with_state={"online"}
        call={false} video_call={false} more={false}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}
      {ActivationIcon === "settings" && <Settings_main />}
    </div>
  );
}
