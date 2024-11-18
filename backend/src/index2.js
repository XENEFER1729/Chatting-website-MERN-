import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// Create the HTTP server
const httpServer = createServer();

// Initialize Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // React frontend URL
        methods: ["GET", "POST"], // Allowing GET and POST requests
        allowedHeaders: ["Content-Type"],
        credentials: true, // Allow credentials (cookies, authentication headers)
    },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("Invalid username"));
    }
    socket.username = username; // Attach username to socket
    socket.id = uuidv4(); // Assign unique ID to socket
    next();
});

// When a user connects
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} (username: ${socket.username})`);

    // Send session data to the client
    socket.emit("session", { userId: socket.id, username: socket.username });
    const users=[];
    for(let [id,socket] of io.of("/").sockets){
        users.push({
            userId:id,
            username:socket.username
        })

    }
    socket.emit("users",users);

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Listen on port 9000
httpServer.listen(9000, () => {
    console.log("Server started on port 9000");
});
