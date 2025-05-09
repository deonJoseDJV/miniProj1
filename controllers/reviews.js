const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
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
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    // console.log(id,reviewId);
    //pull operation is used to remove the review from the listing
    //this is done to remove the review from the listing
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
};

