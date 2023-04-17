const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:String,
    email:{
        unique:true,
        type:String,
        require:true
    },
    password:String,
    role:{
        type:String,
        enum:["User","Moderator"],
        default:"User"
    }
})

const UserModel=mongoose.model("user",userSchema);

module.exports={UserModel}