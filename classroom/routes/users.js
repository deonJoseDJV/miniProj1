const express=require("express");
const app=express();
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Users");
}
);

//show users
router.get("/:id",(req,res)=>{
    res.send("User with id "+req.params.id);
}
);  

//post route
router.post("/",(req,res)=>{
    res.send("User created");
}
);

//delete route
router.delete("/:id",(req,res)=>{
    res.send("User with id "+req.params.id+" deleted");
}
);
module.exports=router;