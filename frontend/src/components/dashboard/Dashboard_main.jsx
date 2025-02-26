import React, { useEffect, useState } from 'react';
import Input from '../form/Input';
import axios from 'axios';
import io from 'socket.io-client';
import Chattingboard from './Chatting_board_compos/Chattingboard';
import Leftfirst from './Left_First_Components/Leftfirst';
import Chatslist from './Left_second/Chatslist';
import Settingsmain from "./Left_second/settings/Settingsmain"

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
  const [ContactsArchived, setContactsArchived] = useState("")
  const [ContactsLocked, setContactsLocked] = useState("")
  const [ContactsFavorate, setContactsFavorate] = useState("")

  //messages
  const [isOpenchat, setisOpenchat] = useState(false)
  const [msg, setMsg] = useState('');
  const [msgEmoji, setMsgEmoji] = useState('');
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
      // console.log(`Message from ${sender}: ${message} from: ${senderid}`)
      setMessages((prevMessages) => [...prevMessages, { message: message, sender: "other" }]);
      setMsg('');
    });

    // Clean up the socket event listener
    return () => {
      socket.off("receiveone2one");
    };
  }, []);


  const sendMessage = () => {
    // console.log("setting last msg")
    // console.log("sending msg :", msg, "to :", localStorage.getItem("receiver_Email"))
    socket.emit('sendone2oneMSG', { senderid: localStorage.getItem("Email"), receiverid: localStorage.getItem("receiver_Email"), message: msg });
    setMessages((prevMessages) => [...prevMessages, { message: msg, sender: "self" }]);
    setMsg('');
  };

  useEffect(() => {
    const fetchdata = async () => {
      const Contact = {}
      const Archived = {}
      const Locked = {}
      const Favorate = {}
      const contactsfetch = await fetch("http://localhost:9000/api/getConversations", {
        method: "GET",
        headers: {
          "Context-type": "application/json",
        }
      })
      const data = await contactsfetch.json()
      // console.log(data)
      const a = localStorage.getItem("Email")
      for (let i in data) {
        // console.log(data[i]["members"])
        if (data[i]["members"][0] === a) {
          Contact[i] = data[i]["members"][1]
          Archived[i] = data[i]["archived"]
          Locked[i] = data[i]["locked"]
          Favorate[i] = data[i]["favorate"]
        }
        if (data[i]["members"][1] === a) {
          Contact[i] = data[i]["members"][0]
          Archived[i] = data[i]["archived"]
          Locked[i] = data[i]["locked"]
          Favorate[i] = data[i]["favorate"]
        }
      }
      // console.log(Archived)
      // console.log(Favorate)
      // console.log(Locked)
      setContacts(Contact)
      setContactsArchived(Archived)
      setContactsLocked(Locked)
      setContactsFavorate(Favorate)
      // console.log(Contacts)
      // console.log("archived: ",ContactsArchived)
      // console.log("Favorate : ",ContactsFavorate)
      // console.log("Locked: ",ContactsLocked)

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
  const sendMessageAI = async () => {
    setMessagesAI((prevMessages) => [...prevMessages, { message: msgAI, sender: "self" }]);

    try {
      const datafetch = await fetch(API, {
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
      const data = await datafetch.json()
      // console.log(data.candidates[0].content.parts[0].text)
      setMessagesAI((prevMessages) => [...prevMessages, { message: data.candidates[0].content.parts[0].text, sender: "other" }]);
    } catch (error) {
      console.log("error in fetching ai questions: ", error)
    }

    setMsgAI('');

  }


  return (
    <div className="w-screen h-screen flex  ">
      <Leftfirst setActivationIcon={setActivationIcon}
        ActivationIcon={ActivationIcon}
        setisOpenchat={setisOpenchat} />

      {ActivationIcon === "chats" && <Chatslist
        Contacts={Contacts}
        ContactsArchived={ContactsArchived}
        ContactsLocked={ContactsLocked}
        ContactsFavorate={ContactsFavorate}
        Archived={false}
        msg={msg} msgAI={msgAI}
        messages={messages} messagesAI={messagesAI}
        openChat={openChat} />}

      {/* Main Chat Area */}
      {ActivationIcon === "chats" && <Chattingboard sendMessage={sendMessage}
        setMsg={setMsg}
        messages={messages}
        setMessages={setMessages}
        socket={socket}
        Input={Input}
        msg={msg}
        Avatar={Avatar}
        chatting_with={chatting_with}
        chatting_with_state={chatting_with_state}
        setActivationIcon={setActivationIcon}
        setMsgEmoji={setMsgEmoji}
        msgEmoji={msgEmoji}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}


      {ActivationIcon === "chatbot" && <Chattingboard sendMessage={sendMessageAI}
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
      {ActivationIcon === "settings" && <Settingsmain />}


      {ActivationIcon === "archive" && <Chatslist
      ActivationIcon={ActivationIcon}
        Contacts={Contacts}
        ContactsArchived={ContactsArchived}
        ContactsLocked={ContactsLocked}
        ContactsFavorate={ContactsFavorate}
        Archived={true}
        msg={msg} msgAI={msgAI}
        messages={messages} messagesAI={messagesAI}
        openChat={openChat} />}

      {ActivationIcon === "archive" && <Chattingboard sendMessage={sendMessage}
        archive={true}
        setMsg={setMsg}
        messages={messages}
        setMessages={setMessages}
        socket={socket}
        Input={Input}
        msg={msg}
        Avatar={Avatar}
        chatting_with={chatting_with}
        chatting_with_state={chatting_with_state}
        setActivationIcon={setActivationIcon}
        setMsgEmoji={setMsgEmoji}
        msgEmoji={msgEmoji}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}


      {ActivationIcon === "favorate" && <Chatslist Contacts={Contacts}
        ContactsArchived={ContactsArchived}
        ContactsLocked={ContactsLocked}
        ContactsFavorate={ContactsFavorate}
        Favorate={true}
        msg={msg} msgAI={msgAI}
        messages={messages} messagesAI={messagesAI}
        openChat={openChat} />}

      {ActivationIcon === "favorate" && <Chattingboard sendMessage={sendMessage}
        archive={true}
        setMsg={setMsg}
        messages={messages}
        setMessages={setMessages}
        socket={socket}
        Input={Input}
        msg={msg}
        Avatar={Avatar}
        chatting_with={chatting_with}
        chatting_with_state={chatting_with_state}
        setActivationIcon={setActivationIcon}
        setMsgEmoji={setMsgEmoji}
        msgEmoji={msgEmoji}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}


      {ActivationIcon === "locked" && <Chatslist Contacts={Contacts}
        ContactsArchived={ContactsArchived}
        ContactsLocked={ContactsLocked}
        ContactsFavorate={ContactsFavorate}
        Locked={true}
        msg={msg} msgAI={msgAI}
        messages={messages} messagesAI={messagesAI}
        openChat={openChat} />}

      {ActivationIcon === "locked" && <Chattingboard sendMessage={sendMessage}
        archive={true}
        setMsg={setMsg}
        messages={messages}
        setMessages={setMessages}
        socket={socket}
        Input={Input}
        msg={msg}
        Avatar={Avatar}
        chatting_with={chatting_with}
        chatting_with_state={chatting_with_state}
        setActivationIcon={setActivationIcon}
        setMsgEmoji={setMsgEmoji}
        msgEmoji={msgEmoji}
        isOpenchat={isOpenchat} setisOpenchat={setisOpenchat} />}
    </div>
  );
}
