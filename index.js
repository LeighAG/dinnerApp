const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
//setup express
const app = express();
app.use(express.json());
app.use(cors());
const path = require('path');

app.use(express.static("client"));

const PORT = process.env.PORT || 5000;


mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {dbName: 'user',
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    'useFindAndModify': false
}, (err)=>{
    if(err) throw err;
    console.log("MongoDB connection established")
})

//set route, allows access to specific user/routes
app.use("/users", require("./routes/userRouter"));
app.use("/dinners", require("./routes/dinnerRouter"));

if(process.env.NODE_ENV === 'production'){
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get("*", function(req, res){
res.sendFile(path.join(__dirname, 'client', 'build','index.html'));  
});
}

app.listen(PORT, () => console.log(`the server has begun on ${PORT}`));