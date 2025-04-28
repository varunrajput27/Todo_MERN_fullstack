const mongoose=require('mongoose');
require("dotenv").config();


//local db
//  const mongURL='mongodb://127.0.0.1:27017/Todo';

// online database
const mongURL=process.env.DB_URL;
 
 mongoose.connect(mongURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
 })
 const db=mongoose.connection;


 db.on('connected',()=>{
    console.log("mongodb is connected")
 })


 db.on('disconnected',()=>{
    console.log("mongodb is disconnected")
 })


 db.on('error',()=>{
    console.log("error with mongodb");
 })

 module.exports=db;

