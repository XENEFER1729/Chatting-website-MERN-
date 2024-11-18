const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:9000"], // Allow frontend from localhost:9000
        methods: ["GET", "POST"],
    },
});

// Middleware to validate username and assign a unique ID
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        console.log("Connection attempt without username");
        return socket.disconnect(true); // Disconnect user
    }
    socket.username = username;
    socket.id = uuidv4(); // Assign a unique ID
    next();
});

// Handle connection
io.on("connection", (socket) => {
    console.log("New user connected:", socket.username, socket.id);
    socket.emit("session", { userId: socket.id, username: socket.username });
});

// Start the server
const PORT = 9000;
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



//wrap

// // server.js
// const express = require("express");
// const app = express();
// const http = require("http");
// const path = require("path");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// const cors=require("cors")

// app.use(cors({origin:"http://localhost:3000"}));
// // app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// // app.use("/backend/src",express.static(path.join(__dirname,"src")))

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// io.on("connection", (socket) => {
//     console.log("A user connected with ID:", socket.id);

//     // Notify when a user disconnects
//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });

//     // Handle private messages
//     socket.on("private message", ({ targetId, msg }) => {
//         console.log(`Message from ${socket.id} to ${targetId}: ${msg}`);

//         // Send the message to the target user
//         io.to(targetId).emit("chat message", `From ${socket.id}: ${msg}`);

//         // Send the same message back to the sender
//         socket.emit("chat message", `To ${targetId}: ${msg}`);
//     });
// });

// server.listen(9000, () => {
//     console.log("Server started on port 9000");
// });

// <!-- <!DOCTYPE html>
// <html>

// <head>
//     <meta name="viewport" content="width=device-width,initial-scale=1.0">
//     <title>Chat App</title>
//     <style>
//         body {
//             margin: 0;
//             padding-bottom: 3rem;
//             font-family: Arial, sans-serif;
//         }

//         #form {
//             position: fixed;
//             bottom: 0;
//             left: 0;
//             right: 0;
//             display: none;
//             background: rgba(0, 0, 0, 0.15);
//             padding: 0.25rem;
//             height: 3rem;
//         }

//         #input, #targetid {
//             flex-grow: 1;
//             padding: 0.5rem;
//             margin: 0.25rem;
//             border-radius: 2rem;
//             border: none;
//         }

//         #input:focus, #targetid:focus {
//             outline: none;
//         }

//         #sendbtn {
//             background: #333;
//             color: #fff;
//             border: none;
//             padding: 0.5rem 1rem;
//             margin: 0.25rem;
//             border-radius: 3px;
//         }

//         #messages {
//             list-style-type: none;
//             padding: 0;
//             margin: 0;
//         }

//         #messages li {
//             padding: 0.5rem 1rem;
//             background: #efefef;
//             margin-bottom: 0.25rem;
//         }
//     </style>
// </head>

// <body>
//     <ul id="messages"></ul>

//     <div id="socket_id_input">
//         <label for="targetid">Target Socket ID:</label>
//         <input id="targetid" type="text" placeholder="Enter target socket ID">
//         <button id="submitid">Submit id</button>
//     </div>

//     <form id="form" action="">
//         <input id="input" autocomplete="off" placeholder="Type a message..." />
//         <button id="sendbtn">Send</button>
//     </form>

//     <script src="/socket.io/socket.io.js"></script>
//     <script> 
//         const socket = io();
//         const messages = document.getElementById("messages");
//         const form = document.getElementById("form");
//         const socket_id_input=document.getElementById("socket_id_input")
//         const input = document.getElementById("input");
//         const targetidInput = document.getElementById("targetid");
//         const submitid=document.getElementById("submitid");

//         submitid.addEventListener("click",(e)=>{
//             e.preventDefault();
//             socket_id_input.style.display="none"
//             form.style.display="flex"
//         })

//         // Display the user's own socket ID
//         socket.on("connect", () => {
//             const idDisplay = document.createElement("li");
//             idDisplay.innerText = `Your Socket ID: ${socket.id}`;
//             messages.appendChild(idDisplay);
//         });

//         // Display received chat messages
//         socket.on("chat message", (msg) => {
//             const item = document.createElement("li");
//             item.innerText = msg;
//             messages.appendChild(item);
//             window.scrollTo(0, document.body.scrollHeight);
//         });

//         // Send a private message on form submission
//         form.addEventListener("submit", (e) => {
//             e.preventDefault();

//             const targetId = targetidInput.value.trim();
//             const message = input.value;

//             if (targetId && message) {
//                 socket.emit("private message", { targetId, msg: message });
//                 input.value = ""; // Clear input after sending
//             } else {
//                 alert("Please enter both a target socket ID and a message.");
//             }
//         });
//     </script>
// </body>

// </html> -->