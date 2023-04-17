const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const { UserModel } = require('../Models/user.model');
const { BlacklistModel } = require('../Models/blacklisting.model');

const userRoute=express.Router();

userRoute.post("/register",async(req,res)=>{
    const {name,email,password,role}=req.body;
    let user=await UserModel.find({email});
    try {
        if(user.length===0){
            bcrypt.hash(password,5,async(err,hash)=>{
              if(err)throw err;
              const userreg=await new UserModel({name,email,password:hash,role});
              userreg.save();
              res.status(200).send({msg:"registeration done"})
            })
        }else{
            res.status(200).send({msg:"user already exist please login!"})
        }
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
   
})

userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    let user=await UserModel.find({email})
    try {
        if(user.length>0){
            bcrypt.compare(password,user[0].password,async(err,result)=>{
                if(err) throw err;
                if(result){
                    const token = jwt.sign({'userID':user[0]._id},'gupta',{ expiresIn:"1m"});
                    const refreshtoken = jwt.sign({'userID':user[0]._id},'refresh',{ expiresIn:"3m"});
                    res.cookie("accessToken",token,{maxAge:1000*60,httpOnly:true,secure:false})
                    res.cookie("accessrefToken",refreshtoken,{maxAge:1000*60*4,httpOnly:true,secure:false})
                    res.status(200).send({msg:"Login sucessfull!"})
                }else{
                    res.status(400).send({msg:"Wrong Credentials!"})
                }
            })
        }else{
            res.status(200).send({msg:"Please register first"})
        }
        
    } catch (error) {
        res.status(200).send({msg:error.message})
    }
})
userRoute.get("/logout",async(req,res)=>{
    const {accessToken,accessrefToken}=req.cookies;
    const blacktoken=await new BlacklistModel({token:accessToken})
    const blackreftoken=await new BlacklistModel({token:accessrefToken})
    blacktoken.save();
    blackreftoken.save();
    res.status(200).send({msg:"logout successfull!"})
})

userRoute.get("/refreshtoken",async(req,res)=>{
    const {accessrefToken}=req.cookies;
    let blacklist=await BlacklistModel.find({token:accessrefToken});
    if(blacklist.length>0){
        res.status(200).send({msg:"Please login again !"})
    }
    else if(accessrefToken){
        decoded=jwt.verify(accessrefToken,'refresh');
        if(decoded.userID){
            let token=jwt.sign({'userID':decoded.userID},'gupta',{expiresIn:"1m"});
            res.cookie("accessToken",token,{maxAge:1000*60,httpOnly:true,secure:false});
            res.send({msg:"new token generated"})
        }
        
    }
    
})





module.exports={userRoute}