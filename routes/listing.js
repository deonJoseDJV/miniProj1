const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");

const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing,validateReview}=require("../middleware.js");
const { MongoCursorInUseError } = require('mongodb');



//index route
router.get("/",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


//new route
router.get("/new",isLoggedIn,(req,res)=>{
   
 
    res.render("listings/new.ejs");
})

//show route
router.get("/:id",
    wrapAsync(async(req,res)=>{
    //we populate the reviews in the listing model
    //this is done to get the reviews of the listing
    const listing=await Listing.findById(req.params.id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        }})
    .populate("owner");
    if (!listing){
        req.flash("error","Cannot find that listing");
        res.redirect("/listings");
    }
    console.log(listing);   
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/",isLoggedIn,validateListing,
    wrapAsync(async(req,res,next)=>{
        // if (!req.body.listing) {
        //     throw new ExpressError(400, "send valid data for listing");
        // }
        // let result=listingSchema.validate(req.body);
        // console.log(result);
        // if (result.error){
        //     throw new ExpressErrir(400,result.error);
        // }
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","Successfully created a new listing");

        res.redirect("/listings");   
    }   
));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing){
        req.flash("error","Cannot find that listing");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
}));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,
    wrapAsync(async(req,res)=>{
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Successfully updated the listing");
    res.redirect(`/listings/${id}`)
}));

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the listing");
    // console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;