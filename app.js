const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const ejs=require("ejs");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const { resolveObjectURL } = require("buffer");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);



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
//till here


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if (error){
        let errMsg=error.details.map((e)=>e.message).join(",");
        
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
// const validateListing = (req, res, next) => {
//     // First check if listing object exists
//     if (!req.body.listing) {
//         throw new ExpressError(400, "Listing data is required");
//     }
    
//     // Then validate just the listing part
//     const { error } = listingSchema.validate(req.body);
    
//     if (error) {
//         let errMsg = error.details.map((e) => e.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


app.get("/",(req,res)=>{
    console.log("Hello World");
    res.send("Hello World");
})


//index route
app.get("/listings",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("index.ejs",{allListings});
}));
//new route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    res.render("show.ejs",{listing});
}));

//create route
app.post("/listings",validateListing,
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
        let resu=await newListing.save();
        console.log(resu);

        res.redirect("/listings");   
    }   
));


//get /listings/:id/edit -> edit form -> submit -> put /listings/:id

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("edit.ejs",{listing})
}));

//update route
app.put("/listings/:id",validateListing,
    wrapAsync(async(req,res)=>{
      
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

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