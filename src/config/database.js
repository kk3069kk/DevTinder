import mongoose from "mongoose";


const mongodb = async ()=>{   
   if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL not found in environment");
  }
   await mongoose.connect(process.env.MONGO_URL);
}


export default mongodb;