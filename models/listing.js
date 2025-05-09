
const { required } = require("joi");
const mongoose=require("mongoose");
// const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    
    image: {
       
           url:String,
           filename:String,
    },

    // image:String,
    price:Number,
    location:String,
    country:String,
    //1->n relationship with reviews
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});

//a post middleware is used to delete the reviews when the listing is deleted
listingSchema.post("findOneAndDelete",async (listing)=>{
    if (!listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }

});
const Listing=mongoose.model("Listing",listingSchema); 
module.exports=Listing;