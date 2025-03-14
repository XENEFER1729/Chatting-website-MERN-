const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid")

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  }
});


// Imports
require("./db/connection");
const Users = require("./models/Users");
const Roomids = require("./models/Roomids")
const Conversation = require("./models/Conversation");
const Message = require("./models/Messages")

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Chatting App API");
});

app.post("/api/register", async (req, res) => {
  try {
    const { Fullname, Username, email, password } = req.body;

    if (!Fullname || !email || !password) {
      return res.status(400).send("Please fill all required fields");
    }


    const isAlreadyExists = await Users.findOne({ email });
    const isAlreadyExistsUsername = await Users.findOne({ Username });
    if (isAlreadyExists) {
      return res.status(201).json({ message: "User already exists" });
    }
    if (isAlreadyExistsUsername) {
      return res.status(201).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new Users({ Fullname, Username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(201).json({ message: "Please fill all required fields" });
    }

    const isAlreadyExists = await Users.findOne({ email });
    if (!isAlreadyExists) {
      return res.status(201).json({ message: "Email not found" });
    }

    const validateUser = await bcryptjs.compare(password, isAlreadyExists.password);
    if (!validateUser) {
      return res.status(201).json({ message: "Invalid Password" });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY || "this_is_a_jwt_secrete_key";
    const payload = {
      userid: isAlreadyExists.id,
      email: isAlreadyExists.email,
    };

    jsonwebtoken.sign(payload, jwtSecretKey, { expiresIn: 84600 }, async (err, token) => {
      if (err) {
        return res.status(500).send("Error generating token");
      }

      await Users.updateOne(
        { _id: isAlreadyExists.id },
        { $set: { token } }
      );
      isAlreadyExists.save();
      res.status(200).json({ user: isAlreadyExists, token });
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/allusers", async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = await Promise.all(users.map(async (user) => {
      return { user: { email: user.email, Username: user.Username, Fullname: user.Fullname, avatar: user.avatar }, userid: user.userid };
    }));
    res.status(200).json(usersData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
  }
});

app.post("/api/RegisterRoom", async (req, res) => {
  console.log("register room")
  const { roomid } = req.body;
  console.log(roomid)
  const newroomid = new Roomids({ roomid });
  await newroomid.save();
  // roomid_r.save();
  return res.status(200).send(newroomid)
})

app.get("/api/seeRooms", async (req, res) => {
  console.log("see available rooms")
  const Allroomids = await Roomids.find()
  console.log(Allroomids);
  return res.status(200).send(Allroomids);
})

app.post("/api/createConversation", async (req, res) => {
  const { senderid, receiverid } = req.body;
  if (senderid === receiverid) {
    return res.status(400).json({ message: "Cannot create a conversation with the same user." });
  }

  try {
    console.log("Creating conversation...");
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderid, receiverid] },
    });
    if (existingConversation) {
      return res.status(400).json({ message: "Conversation already exists between these users." });
    }
    const conversationId = uuidv4();
    const newConversation = new Conversation({
      Conversation_id: conversationId,
      members: [senderid, receiverid],
    });
    await newConversation.save();
    return res.status(200).json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/getConversations", async (req, res) => {
  const allConversations = await Conversation.find()
  return res.status(200).send(allConversations);
})
app.post("/api/getLastMessage", async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const message = await Message.findOne({
      $or: [
        { senderid: user1, receiverid: user2 },
        { senderid: user2, receiverid: user1 }
      ]
    }).sort({ timestamp: -1 });

    if (!message) {
      return res.status(404).json({ error: "No messages found" });
    }
    const sender = await Users.findOne({ email: message.senderid });

    res.status(200).json({
      message,
      senderUsername: sender ? sender.Username : null
    });

  } catch (error) {
    console.error("Error fetching last message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/UpdateMsgRead", async (req, res) => {
  try {
    const { user1, user2, read } = req.body;
    const messageUpdate = await Message.updateMany(
      {
        $or: [
          { senderid: user1, receiverid: user2 },
          { senderid: user2, receiverid: user1 }
        ]
      },
      { $set: { msgRead: read } }
    );

    const message2 = await Message.find({
      $or: [
        { senderid: user1, receiverid: user2 },
        { senderid: user2, receiverid: user1 }
      ]
    });

    const sender = await Users.findOne({ email: messageUpdate.senderid });

    res.status(200).json({
      message2,
      senderUsername: sender ? sender.Username : null
    });

  } catch (error) {
    console.error("Error fetching last message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/getmessage", async (req, res) => {
  const { senderid, receiverid } = req.body;
  const message = await Message.find({
    $or: [
      { senderid: senderid, receiverid: receiverid },
      { senderid: receiverid, receiverid: senderid }
    ]
  }).sort({ timestamp: 1 });
  // console.log(message)
  res.status(201).json(message)
})

app.put("/api/setAvatar", async (req, res) => {
  const { email, avatarnew } = req.body;
  try {
    const avatarUpdate = await Users.updateOne(
      { email: email },
      { $set: { avatar: avatarnew } }
    );
    // console.log(avatarUpdate);
    res.status(200).json({
      message: "Avatar updated successfully",
      email: email,
      newAvatar: avatarnew
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/getAvatar", async (req, res) => {
  const { email } = req.body;
  try {
    const avatarnew = await Users.find({
      email: email
    })
    res.status(201).json(avatarnew);
  } catch (error) {
    console.log("User not found")
    res.status(201).json({ message: "user not found" })
  }
})

app.post("/api/archive", async (req, res) => {
  const { user1, user2, archived } = req.body;

  try {
    const updatedConversation = await Conversation.updateOne(
      { members: { $all: [user1, user2] } }, // Find conversation with both users
      {
        $set: {
          favorate: !archived, 
          locked: !archived,  
          archived: archived 
        }
      }
    );

    res.status(201).json(updatedConversation);
  } catch (error) {
    console.log("Error updating conversation:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/favorate", async (req, res) => {
  const { user1, user2, favorate } = req.body;

  try {
    const updatedConversation = await Conversation.updateOne(
      { members: { $all: [user1, user2] } },
      {
        $set: {
          favorate: favorate,
          locked: !favorate,  
          archived: !favorate  
        }
      }
    );

    res.status(201).json(updatedConversation);
  } catch (error) {
    console.log("Error updating conversation:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/lock", async (req, res) => {
  const { user1, user2, lock } = req.body;

  try {
    const updatedConversation = await Conversation.updateOne(
      { members: { $all: [user1, user2] } },
      {
        $set: {
          favorate: !lock,
          locked: lock,
          archived: !lock  
        }
      }
    );

    res.status(201).json(updatedConversation);
  } catch (error) {
    console.log("Error updating conversation:", error.message);
    res.status(500).json({ message: error.message });
  }
});



app.delete("/api/clearConversation", async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both user1 and user2 are required" });
    }

    const conv = await Conversation.deleteOne({
      members: { $all: [user1, user2] }
  });
    

    const messages = await Message.deleteMany({
      $or: [
        { senderid: user1, receiverid: user2 },
        { senderid: user2, receiverid: user1 }
      ]
    });

    res.status(200).json({
      message: "Conversation and messages deleted successfully",
      deletedConversation: conv.deletedCount,
      deletedMessages: messages.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.post("/api/setCallingId", async (req, res) => {
  const { email, callingId } = req.body;
  try {
    const callingIdUpdate = await Users.updateOne(
      { email: email },
      { $set: { callingId } }
    )
    res.status(201).json({
      message: "CallingId updated successfully",
      email: email,
      callingId: callingId
    });
  } catch (error) {
    console.error("Error updating callingId:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.post("/api/getCallingId", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ callingId: user.callingId });
  } catch (error) {
    console.error("Error fetching callingId:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.delete("/api/clearChat", async (req, res) => {
  const { user1, user2 } = req.body;
  const messages = await Message.deleteMany({
    $or: [
      { senderid: user1, receiverid: user2 },
      { senderid: user2, receiverid: user1 }
    ]
  });
  res.status(200).json({
    messages,
  });

})

const users_sockets = {}
io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  socket.on("register", (userid) => {
    users_sockets[userid] = socket.id;
    // console.log(`User ${userid} registered with socket ID: ${socket.id}`);
  })

  socket.on("sendone2oneMSG", async ({ senderid, receiverid, message }) => {
    // console.log("sending to ",users_sockets[receiverid],"by ",senderid)
    const newMessage = new Message({
      senderid: senderid,
      receiverid: receiverid,
      message: message
    })
    try {
      await newMessage.save()
    } catch (error) {
      console.log("en error has occured in sending the message")
    }
    socket.broadcast.to(users_sockets[receiverid]).emit("receiveone2one", { sender: socket.id, message, senderid })
    // console.log(`Message sent to ${receiverid} from ${senderid}`)
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});


server.listen(9000, () => {
  console.log("Server is running on port 9000");
});
