const mongoose=require('mongoose');

const blogSchema=mongoose.Schema({
    title:String,
    content:String,
    status:Boolean,
    userID:String
})

const BlogModel=mongoose.model("blog",blogSchema);

module.exports={BlogModel}