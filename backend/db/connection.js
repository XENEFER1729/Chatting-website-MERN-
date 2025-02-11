const mongoose = require("mongoose");

const url = "mongodb+srv://vivek:Vivek%402006@chattingapp.aayqz.mongodb.net/";

mongoose
    .connect(url, {
        useNewUrlParser: true, // Use the new URL parser
        useUnifiedTopology: true, // Ensure compatibility with the MongoDB driver
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Unable to connect to MongoDB", error);
    });
