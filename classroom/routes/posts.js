const express=require("express");
const app=express();

const router=express.Router();

router.get("/posts",(req,res)=>{
    res.send("Users");
}
);

//show users
router.get("/posts/:id",(req,res)=>{
    res.send("User with id "+req.params.id);
}
);  

//post route
router.post("/posts",(req,res)=>{
    res.send("User created");
}
);

//delete route
router.delete("/posts/:id",(req,res)=>{
    res.send("User with id "+req.params.id+" deleted");
}
);
module.exports=router;