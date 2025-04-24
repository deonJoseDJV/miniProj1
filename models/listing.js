
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
       
            type: String,
            required: true,
            default: "https://images.unsplash.com/photo-1742943679521-f4736500a471?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8", // Set default image URL
        
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
});

//a post middleware is used to delete the reviews when the listing is deleted
listingSchema.post("findOneAndDelete",async (listing)=>{
    if (!listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }

});
const Listing=mongoose.model("Listing",listingSchema); 
module.exports=Listing;