const mongoose=require("mongoose")

const Roomidschema=mongoose.Schema({
    roomid:{
        type:String,
        required:true
    }
})

const Roomids=mongoose.model("Roomids",Roomidschema)

module.exports=Roomids;