const mongoose = require('mongoose');

const dinnerSchema = new mongoose.Schema({
    
    dates: {type:String, required:true, unique: true},
    dinnerPlan: [{
    day: {type: String},
    name: {type: String},
    recipe: {type: String},
    website: {type: String},
    notes: {type: String}
    }],
    UserID:{type:String}
})


//export a variable called dinner which will be mongoose.model
//this allows us to search and save users
//user collection and user schema on how to format it
module.exports = DinnerPlan = mongoose.model("dinner", dinnerSchema);
