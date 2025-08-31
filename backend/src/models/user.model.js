import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    name:{
         type:String,
        require:true,
        

    },
    image:{
        type:String,
        require:true
    },
    clerkId:{
        type:String,
        require:true,
        unique:true
    },
    
},{timestamps:true})

export const User=mongoose.model("User",userSchema)