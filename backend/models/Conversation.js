const mongoose = require("mongoose")

const Conversactionschema = mongoose.Schema({
    Conversation_id: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    LastMessage: {
        type: String,
        required: true,
        default: " hello"
    },
})

const Conversation = mongoose.model("Conversaction", Conversactionschema)

module.exports = Conversation;