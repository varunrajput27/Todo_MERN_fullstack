const mongoose=require('mongoose');
require("dotenv").config();


//local db
//  const mongURL='mongodb://127.0.0.1:27017/Todo';

// mongpdb atlas
const mongURL=process.env.DB_URL;
 
mongoose.connect(mongURL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

 const db=mongoose.connection;


 db.on('disconnected',()=>{
    console.log("mongodb is disconnected")
 })


 db.on('error',()=>{
    console.log("error with mongodb");
 })

 module.exports=db;

