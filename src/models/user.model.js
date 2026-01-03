import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is require"],
        trim:true,
        maxlength:15,
        minlength:4,

    },
    lastName:{
        type:String,
        trim:true,
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("wrong Email Id")
            }
        },

    },
    age:{
        type:Number,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","Female","others"].includes(value)){
                throw new Error("give valid data");
            }
        },
    },
    photoURL :{
        type:String,
        validate(value){
            if(! validator.isURL(value)){
                throw new Error("give correct Photo URL"); 
            }
        }
    }

},{
    timestamps:true
})

const User = mongoose.model('User' ,userSchema);

export default User;