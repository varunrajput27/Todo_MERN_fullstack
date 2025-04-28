const mongoose=require('mongoose');
const bcrypt = require('bcrypt')

const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

//performing  hashing function using bcrypt
personSchema.pre('save', async function (next) {
    const newperson = this;
    if (!newperson.isModified('password'))
        
        { 
            return next();

         }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(newperson.password, salt);
        newperson.password = hashpassword;
        next();
    }
    catch (err) {
        return next(err);
    }
})


//compare method to check databse passowrd and  person passowrd same or not
personSchema.methods.comparepassword = async function (personpassword) {
    try {
        const ismatch = await bcrypt.compare(personpassword, this.password)
        return ismatch;
    }
    catch (err) {
        throw err;
    }

}


const Person=mongoose.model("Person",personSchema);
module.exports=Person;