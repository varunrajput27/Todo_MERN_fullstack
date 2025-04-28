const mongoose=require("mongoose");

const FieldSchema=new mongoose.Schema({
    username:{
        type:String,
        
    },
    tasks: [
        {
            text: { 
                type: String, 
                required: true 
            },
            completed: {
                type: Boolean,
                default: false, 
            },
        },
    ],

})
const Allfield=mongoose.model("Allfield",FieldSchema);

module.exports=Allfield;