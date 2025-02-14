const mongoose = require("mongoose")

const Messagesschema = mongoose.Schema({
    senderid: {
        type: String,
        required: true
    },
    receiverid: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    msgRead:{
        type:String,
        required:true,
        default:"no"
    }
})

const Message = mongoose.model("message", Messagesschema)

module.exports = Message;