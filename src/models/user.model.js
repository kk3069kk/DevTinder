import mongoose from "mongoose";
import validator from 'validator';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is require"],
        index:true,
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
    },
    skills:{
        type:[String],
    },
    about:{
        type:String,
    }


},{
    timestamps:true
});


userSchema.methods.getJwt = async function(){
    const user =this;

   const token =  jwt.sign({_id:user._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES,
    });
    return token;
}

userSchema.methods.isPasswordValid = async function (password) {
    const user = this;

    const validity = await bcrypt.compare(password,user.password);
    return validity;
}

const User = mongoose.model('User' ,userSchema);

export default User;