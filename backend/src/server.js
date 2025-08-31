import express from "express"
import dotenv from 'dotenv'
import { connectDb } from "./db/db.js";
import {clerkMiddleware} from "@clerk/express"

const app=express()
dotenv.config();
const PORT=process.env.PORT

app.use(clerkMiddleware())


app.get('/',(req,res)=>{
    res.send("hello world");
    
})

app.listen(PORT,()=>{
    console.log(`server Listning on ${PORT}`);
    connectDb();
})