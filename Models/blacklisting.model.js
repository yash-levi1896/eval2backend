const mongoose=require('mongoose');

const blackSchema=mongoose.Schema({
    token:String
})

const BlacklistModel=mongoose.model("blacklist",blackSchema);


module.exports={BlacklistModel}