import validator from "validator";

export const validation = (req)=>{
   const {firstName ,lastName , emailId , password}  = req.body;

   if(!firstName || !lastName) throw new Error("Enter full name");
   if(!validator.isEmail(emailId)) throw new Error("enter correct email");
   if(!validator.isStrongPassword(password)) throw new Error("give correct password");
}

