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
    favorate:{
        type:Boolean,
        default:false
    },
    locked:{
        type:Boolean,
        default:false
    },
    archived:{
        type:Boolean,
        default:false
    },

})

const Conversation = mongoose.model("Conversaction", Conversactionschema)

module.exports = Conversation;