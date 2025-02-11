const mongoose=require("mongoose")

const AvatarSchema=mongoose.Schema({
    email:{
        required:true,
        type:String
    },
    avatar:{
        required:true,
        type:String,
        default:"https://media.istockphoto.com/id/1313958250/vector/user-avatar-profile-icon-black-vector-illustration-on-transparent-background-website-or-app.jpg?s=612x612&w=0&k=20&c=oGGyxXc1jaRAopcs4ZEkZ1LbtAoQwKp4Q0niLvJNk-o="
    }
})

const Avatar=mongoose.model("avatar",AvatarSchema)
module.exports=Avatar