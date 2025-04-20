const mongoose=require("mongoose");


const reviewSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model("Review",reviewSchema);


//here 1->n as one listing can have many reviews
//so associate array of reviews