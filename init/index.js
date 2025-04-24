const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


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

const initDB=async()=>{
    //first we clear the database, then insert the data
    await Listing.deleteMany({});
    //  module.exports = { data: sampleListings };
    initData.data=initData.data.map((obj)=>({...obj, owner:"6809bbf4de88d4f25c55c48c"}));
    await Listing.insertMany(initData.data);
    console.log("Data inserted");
};
initDB();