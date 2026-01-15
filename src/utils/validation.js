import validator from "validator";

export const validation = (req)=>{
   const {firstName ,lastName , emailId , password}  = req.body;

   if(!firstName || !lastName) throw new Error("Enter full name");
   if(!validator.isEmail(emailId)) throw new Error("enter correct email");
   if(!validator.isStrongPassword(password)) throw new Error("give correct password");
}

export const validateProfileEdit = (req)=>{
   const allowed = [
      "lastName",
      "age",
      "gender",
      "photoURL",
      "skills",
      "about",
   ]

   const isUpdateAllowed = Object.keys(req.body).every((field)=>
    allowed.includes(field));

   return isUpdateAllowed;
}