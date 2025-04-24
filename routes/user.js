const express=require('express');
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

// router.post("/signup",wrapAsync(async (req,res)=>{  
//     try{
//         let { username,email,password }=req.body;
//         const newUser=new User({email,username});
//         const registeredUser=await User.register(newUser,password);
//         console.log(registeredUser);
//         req.login(registeredUser,(err)=>{
//             if(err){
//                 return next(err);
//             }
//             req.flash("success","Welcome to Wanderlust");
//             return res.redirect(req.session.redirectUrl );
//         });
//     }   
//     //if error comes; still redirect to signup page
    
//     catch(e){
//         req.flash("error",e.message);
//         res.redirect("/signup");
    
//     }
// }
// ));

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");

            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl;

            return res.redirect(redirectUrl);  // ✅ Ends here
        });

        // ❌ Remove this line — you CANNOT redirect again after already redirecting!
        // req.flash("success","Welcome to Wanderlust");
        // res.redirect("/listings");

    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");  // ✅ always return after res.redirect
    }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
}
);
//in between we have the middleware; that is the authenticate part here
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    async(req,res)=>{
        req.flash("success","Welcome back!");
        res.redirect(res.locals.redirectUrl || "/listings");    
       
    }    
);

router.get("/logout",(req,res,next)=>{
    //req.logout is a passport method
    //it takes a callback function
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    });
}
);
module.exports=router;
