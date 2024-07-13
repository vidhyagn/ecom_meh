
import { Binary } from "mongodb";
import {mongoose} from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    emailid:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    shippingaddress:{
        type:{},
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    refreshToken:{
        type:String,
    }
},{
    timestamps:true
});

export default mongoose.model("users",userSchema);

