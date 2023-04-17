const express=require('express');
const cookieParser=require('cookie-parser')
require("dotenv").config();
const connection=require('./db');
const { userRoute } = require('./Routes/user.routes');
const {blogRoute}=require('./Routes/blogs.routes')
const { authentication } = require('./Middlewares/authentication.middleware');
const app=express();

app.use(cookieParser())
app.use(express.json());


app.use("/user",userRoute)
app.use(authentication);
app.use("/blogs",blogRoute)




app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log("connected to server")
})