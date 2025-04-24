const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Listing=require("../models/listing.js");



//reviews
//post route
//wrapasync is used to handle async errors that is the basic error handling
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    // let {id}=req.params;
    let listing=await Listing.findById(req.params.id);
    //create a new review NB: Review is a model
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Successfully created a new review");
    res.redirect(`/listings/${listing._id}`);
}));


//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    // console.log(id,reviewId);
    //pull operation is used to remove the review from the listing
    //this is done to remove the review from the listing
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;