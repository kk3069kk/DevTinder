import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
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
        enum: ["Male","Female"],
    }

},{
    timestamps:true
})

const User = mongoose.model('User' ,userSchema);

export default User;