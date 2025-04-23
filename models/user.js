const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

//username,hashing all will be done automatically by passport-local-mongoose
//thats why this plugin is used
userSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model("User",userSchema);