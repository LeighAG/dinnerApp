const router = require('express').Router();
//export a variable called user which will be mongoose.model
const express = require('express');
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");


router.post("/register", async (req,res) => {
    try{
    //req.body will parse json body bc we have json body parser already required
    const{email, password, passwordCheck, displayName} = req.body;
//validate
if(!email|| !password || !passwordCheck || !displayName){
    return res.status(400).json({msg:"Not all fields have been entered"})}
if(password.length<5){
    return res.status(400).json({msg: "password must be at least 5 characters in length."})
};
if(password !== passwordCheck){
    return res.status(400).json({msg: "The passwords do not match. Please re-enter matching passowrds."})
} 
// req user model to find whether a duplicate email exists

const existingUser = await User.findOne({email: email});

if(existingUser)
{return res.status(400)
.json({
    msg: "User email already exists. Pls enter a different email or log in."
});
} else {console.log("OK")}
// store passwords by using hashing
// use bcryptjs for this, create 'salt' 
// creates random thing attached to password
const salt = await bcrypt.genSalt();  
const passwordHash = await bcrypt.hash(password, salt); 
//save to db 
const newUser = new User({
    email,
    password: passwordHash,
    displayName
});
const savedUser = await newUser.save();
res.json(savedUser);

}catch(err){
        res.status(500).json({error: err.message});
    }
})


router.post("/login", async(req,res)=>{
    try{
const { email, password } = req.body;
    //validate
if(!email || !password)
return res.status(400).json({msg: "Not all fields are entered."})
//find email match  
const user = await User.findOne({email: email});
if(!user)
return res
.status(400)
.json({msg: "No account with that email found."})
//if there is a match, move on to password validation
const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch)
return res
.status(400)
.json({msg: "This is not the correct password."})
//the token needs something to sign onto, here it is the id
//then it will create an encrypted code from our secret code
const token =jwt.sign({id: user._id}, process.env.JWT_SECRET);
res.json({
    token,
    user:{
        id: user._id,
        displayName: user.displayName
    }
})
console.log(user);
}
catch(err){
        res.status(500).json({error: err.message});
    }
});


//add middleware module as second arguement
//to delete one's account
router.delete("/delete", auth, async (req, res)=>{
    //need to include middleware, function that will run before
    //delete function to validate before deleting
    try{
   const deletedUser =  await User.findByIdAndDelete(req.user);
   res.json(deletedUser);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});
//to confirm a user is logged in
router.post("/tokenIsValid", async(req, res) =>
{
    try{
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}
)

router.get("/", auth, async (req,res)=>{
 const user = await User.findById(req.user);
 console.log(user);
 res.json({
     displayName: user.displayName,
     id: user._id
 });   
});

module.exports = router;