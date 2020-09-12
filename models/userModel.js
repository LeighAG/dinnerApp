const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true, minlength: 5},
    displayName: {type: String, required:true},
  
});
//export a variable called user which will be mongoose.model
//this allows us to search and save users
//user collection and user schema on how to format it
module.exports = User = mongoose.model("user", userSchema);
