const Listing=require("../models/listing");

const User=require("../models/user");


module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async (req, res, next) => {
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
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login= async(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");      
};
module.exports.logout=(req,res,next)=>{
    //req.logout is a passport method
    //it takes a callback function
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    });
};