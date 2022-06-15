const express        = require("express"),
      router         = express.Router(),
	  Joi            = require("joi"),
	  passport       = require("passport"),
	  User           = require("../models/user.js"),
	  ExpressError   = require("../utilities/ExpressError.js"),
	  catchAsync     = require("../utilities/catchAsync.js"),
	  mw             = require("../middlewares/middlewares.js")

// REGISTER FORM ROUTE
router.get("/register", (req,res) => {
	res.render("users/register")
})

// REGISTER LOGIC ROUTE
router.post("/register", mw.validateUserRegistration, catchAsync(async(req,res) => {
	const {email,username,password} = req.body;
	await User.register(new User({email,username}),password)
	passport.authenticate("local")(req,res,() => {
		req.flash("success", "Successfully Signed Up! Nice to meet you " + req.user.username + ".");
		res.redirect("/campgrounds")
	})
}))

// LOGIN FORM ROUTE
router.get("/login", (req,res) => {
	res.render("users/login")
})

// LOGIN LOGIC ROUTE
router.post("/login", mw.validateUserLogin, passport.authenticate("local", {
	failureRedirect: "/login",
	failureFlash: {type: "error", message: "Invalid username or password."}
}),(req,res) => {
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	req.flash("success", "Logged in! Welcome " + req.user.username + ".");
	res.redirect(redirectUrl);
})

// LOGOUT ROUTE
router.get("/logout", (req,res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
})

module.exports = router;