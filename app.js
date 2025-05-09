
if (process.env.NODE_ENV != "production") {
    // console.log("Development mode");
    require("dotenv").config();
}

// console.log(process.env.SECRET);


const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const ejs=require("ejs");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const flash=require("connect-flash");
//for server side validation
// const {listingSchema,reviewSchema}=require("./schema.js");

// const Review=require("./models/review.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session = require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRoute=require("./routes/user.js");




//main connection part
main()
.then(()=>{
    console.log("Connected to the database");
})
.catch((err)=>{
    console.log("Error connecting to the database",err);
})

async function main(){
    await mongoose.connect("mongodb://localhost:27017/wanderlust");

}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);

//for expiry date of the cookie
//it actually exist for 7 days as set by us 
//date.now() is the current date and time given in ms;
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        //to prevetn crossscripting attacks we use httpOnly
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}



//these flashes must be used before the routes as this must be used in it
app.use(session(sessionOptions));
app.use(flash());

//for every request we get the passport initialized
app.use(passport.initialize());
//same user trying to login again or not checking the session for that
app.use(passport.session());
//to make the login and logout work
passport.use(new LocalStrategy(User.authenticate()));

//static one to serialize and deserialize the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//till here

//for the server side validation part
// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
    
//     if (error){
//         let errMsg=error.details.map((e)=>e.message).join(",");
        
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }

// const validateReview=(req,res,next)=>{
//     console.log("received body:",req.body);
//     let {error}=reviewSchema.validate(req.body);
    
//     if (error){
//         let errMsg=error.details.map((e)=>e.message).join(",");
        
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // res.locals.error=req.flash("error");
    
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })
//     //helloworld is the password
//     //this is the password that we are using to register the user
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });
//instead of all the routes in app.js
//we can use the routes in a separate file
app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRoute);


// app.get("/",(req,res)=>{
//     console.log("ROOT DIRECTORY -> traverse to listings");
//     res.send("ROOT DIRECTORY -> traverse to listings");
// })


//index route
// app.get("/listings",wrapAsync(async(req,res)=>{
//     let allListings=await Listing.find({});
//     res.render("index.ejs",{allListings});
// }));
//new route
// app.get("/listings/new",(req,res)=>{
//     res.render("new.ejs");
// })

//show route
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     //we populate the reviews in the listing model
//     //this is done to get the reviews of the listing
//     let listing=await Listing.findById(req.params.id).populate("reviews");
//     res.render("show.ejs",{listing});
// }));

//create route
// app.post("/listings",validateListing,
//     wrapAsync(async(req,res,next)=>{
//         // if (!req.body.listing) {
//         //     throw new ExpressError(400, "send valid data for listing");
//         // }
//         // let result=listingSchema.validate(req.body);
//         // console.log(result);
//         // if (result.error){
//         //     throw new ExpressErrir(400,result.error);
//         // }
//         const newListing=new Listing(req.body.listing);
//         await newListing.save();

//         res.redirect("/listings");   
//     }   
// ));


//get /listings/:id/edit -> edit form -> submit -> put /listings/:id

//edit route
// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("edit.ejs",{listing})
// }));

//update route
// app.put("/listings/:id",validateListing,
//     wrapAsync(async(req,res)=>{
      
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing})
//     res.redirect(`/listings/${id}`)
// }));

//delete route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let deletedListing=await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));


//reviews
//post route
//wrapasync is used to handle async errors that is the basic error handling
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     // let {id}=req.params;
//     let listing=await Listing.findById(req.params.id);
//     //create a new review NB: Review is a model
//     let newReview=new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
// }));


// //delete review route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId}=req.params;
//     // console.log(id,reviewId);
//     //pull operation is used to remove the review from the listing
//     //this is done to remove the review from the listing
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));

//
// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"Test Listing",
//         description:"This is a test listing",
//         price:100,
//         location:"Test Location",
//         country:"Test Country"
//     });
//     await sampleListing.save()
 
//     console.log("Listing saved");
//     res.send("successful testing");
    
   
    
// })

//middleware for error handling
// app.use((err,req,res,next)=>{
//     console.log(err);
//     res.status(500).send("Something went wrong");
// });
// app.js or server.js

// ... your routes here ...

app.all("*", (req, res,next) => {
    next(new ExpressError(404,"Page Not Found"));
    
});
app.use((err, req, res, next) => {
    // console.error(err); // for dev debugging
  
    // if (err.name === 'CastError') {
    //   return res.status(400).json({
    //     error: `Invalid value for ${err.path}: expected a ${err.kind}, got "${err.value}"`
    //   });
    // }
  
    // res.status(500).json({ error: 'Something went wrong!' });
    let {statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
  });
  


app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})