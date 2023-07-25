import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true  //use for remove white
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        requried:true
    },
    address:{
        type:{},
        requried:true
    },
    answer:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },

},{timestamps:true})


export default mongoose.model("users",userSchema)