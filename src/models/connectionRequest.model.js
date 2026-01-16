import mongoose from "mongoose";

const connectionRequestSchema= new mongoose.Schema({
   fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   status:{
    type:String,
    required:true,
    enum:["ignored","accepted","interested","rejected"]
   }
},
{
  timestamps:true
})

connectionRequestSchema.index({fromUserId:1 , toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connection =this;

    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error("cannot send request to yourself");
    }
    next();
})

const ConnectionRequest = mongoose.model('ConnectionRequest',connectionRequestSchema);

export default ConnectionRequest;