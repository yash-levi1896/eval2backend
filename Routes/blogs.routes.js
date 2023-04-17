const express=require('express');
const { BlogModel } = require('../Models/blog.model');
const jwt=require('jsonwebtoken');
const {authrole}=require('../Middlewares/authorisation.middleware')
const blogRoute=express.Router();


blogRoute.get("/",authrole(["User"]),async(req,res)=>{
    let blogs=await BlogModel.find();
    res.status(200).send(blogs);
})

blogRoute.post("/post",authrole(["User"]),async(req,res)=>{
    try {
        const user=await new BlogModel(req.body);
        user.save();
        res.status(200).send({msg:"Blog posted!"})
    } catch (error) {
        res.status(400).send({msg:"something went Wrong!"})
    }
   
})

blogRoute.delete("/delete/:blogid",authrole(["User"]),async(req,res)=>{
    const {blogid}=req.params;
    blog=await BlogModel.findOne({_id:blogid});
    const {accessToken}=req.cookies;
    let decoded=jwt.verify(accessToken,'gupta')
    if(blog.userID==decoded.userID){
        await BlogModel.findByIdAndDelete({_id:blogid});
        res.status(200).send({msg:"blog deleted!"})
    }else{
        res.status(400).send({msg:"can not delet othres's people blogs!"})
    }
})

blogRoute.patch("/update/:blogid",authrole(["User"]),async(req,res)=>{
    const {blogid}=req.params;
    blog=await BlogModel.findOne({_id:blogid});
    const {accessToken}=req.cookies;
    let decoded=jwt.verify(accessToken,'gupta')
    if(blog.userID==decoded.userID){
        await BlogModel.findByIdAndUpdate({_id:blogid},req.body);
        res.status(200).send({msg:"blog updated!"})
    }else{
        res.status(400).send({msg:"can not update othres's people blogs!"})
    }
})

blogRoute.delete("/deleteby/:blogid",authrole(["Moderator"]),async(req,res)=>{
    const {blogid}=req.params;
    await BlogModel.findByIdAndDelete({_id:blogid});
    res.status(200).send({msg:"blog deleted!"})
})











module.exports={blogRoute}