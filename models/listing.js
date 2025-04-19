
const { required } = require("joi");
const mongoose=require("mongoose");
// const Schema=mongoose.Schema;

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
});

const Listing=mongoose.model("Listing",listingSchema); 
module.exports=Listing;