const express          = require("express"),
      app              = express(),
	  locus            = require("locus"),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
	  session          = require("express-session"),
	  MongoStore       = require('connect-mongo'),
	  passport         = require("passport"),
	  LocalStrategy    = require("passport-local"),
	  methodOverride   = require("method-override"),
	  flash            = require("connect-flash"),
	  mongoSanitize    = require("express-mongo-sanitize"),
	  dotenv           = require('dotenv').config(),
// requiring models
	  Comment          = require("./models/comment.js"),
	  Campground       = require("./models/campground.js"),
	  User             = require("./models/user.js"),
// requiring routes
	  campgroundRoutes = require("./routes/campgrounds.js"),
	  commentRoutes    = require("./routes/comments.js"),
	  authRoutes       = require("./routes/auth.js"),
	  indexRoutes      = require("./routes/index.js")


mongoose.connect(process.env.DATABASEURL);
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(mongoSanitize());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({
	store: MongoStore.create({
		mongoUrl: process.env.DATABASEURL,
		secret: process.env.SECRET,
		touchAfter: 24 * 60 * 60
	}),
	name: process.env.NAME,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	proxy: true,
	cookie: {
		httpOnly: true,
		secure: process.env.BOOLEAN,
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000
	}
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.moment = require("moment");
	next();
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);
app.use("/", indexRoutes);

app.use((err,req,res,next) => {
	const {status = 500, message = "Something went wrong!"} = err;
	if(err.message==="Campground not found") {
		return res.status(status).render("errors/campground_not_found",{message: err.message});
	}
	if(err.message==="Comment not found") {
		return res.status(status).render("errors/comment_not_found",{message: err.message});
	}
	if(err.name==="UserExistsError") {
		//add flash message "A user with the given username is already registered"
		req.flash("error", "A user with the given username is already registered.")
		return res.redirect("/register");
	}
	if(err.name==="MongoError"&&err.code===11000) {
		//add flash message "A user with the given email address is already registered"
		req.flash("error", "A user with the given email address is already registered.")
		return res.redirect("/register");
	}
	if(err.name==="CastError") {
		return res.status(400).render("errors/cast_error");
	}
	res.status(status).render("errors/internal_server")
})

const PORT = process.env.PORT || 3000
app.listen(PORT,function() {
	console.log("YelpCamp Server has started!!")
})



/*
Campground.create({
	name: "Beryl's Campsite",
	image: "https://assets.bedful.com/images/7552501bd1d004501a9aa4318e98bd348f308cc8/large/image.jpg",
	description: "This is a huge Beryl's campsite, no bathrooms. No water. Beautiful Beryl's campsite."
},function(err,campground) {
	if(err) {
		console.log(err)
	} else {
		console.log(campground)
	}
})
*/
/*
const campgrounds = [
		{
		 name: "Beryl's Campsite", 
		 image: "https://assets.bedful.com/images/7552501bd1d004501a9aa4318e98bd348f308cc8/large/image.jpg"
		},
		{
		 name: "Fox Wood Camping", 
		 image: "https://assets.bedful.com/images/a98e429c4becdf7fc91f767244451bdd7a2e64c7/large/image.jpg"
		},
		{
		 name: "Graig Wen", 
		 image: "https://assets.bedful.com/images/505526b5edb9109a15fe63fdf43c096d2dba04e1/large/image.jpg"
		},
		{
		 name: "Catgill Campsite", 
		 image: "https://assets.bedful.com/images/dcce4189ba07af4ce36a62d34b827b5a0af29e1c/large/image.jpg"
		},
		{
		 name: "Lepe Beach Campsite", 
		 image: "https://assets.bedful.com/images/11b42de0ece4b4b49c4eb6f7a8ce8263ead235ad/large/image.jpg"
		},
		{
		 name: "Cornish Tipi Holidays", 
		 image: "https://assets.bedful.com/images/1548b967fd90073f86a62548b057ec7766474be9/large/image.jpg"
		},
		{
		 name: "Muasdale", 
		 image: "https://assets.bedful.com/images/79873b056398d0a06da1f83281398dd857612aa4/large/image.jpg"
		},
		{
		 name: "Ocean Pitch Campsite", 
		 image: "https://assets.bedful.com/images/8c9fda10cdcebe57e2c643dfd9e4f60391d333aa/large/image.jpg"
		},
		{
		 name: "Middle Stone Farm", 
		 image: "https://assets.bedful.com/images/c7e5a81e70077f4ec7520dbfc917c7a49258bd59/large/image.jpg"
		}
	]
	*/

/*
Campground.findOne({name: "Fox Wood Camping"},function(err,foundCampground) {
	if(err) {
		console.log(err)
	} else {
		Comment.create({text: "I love this place", author: "Homer"},function(err,comment) {
			if(err) {
				console.log(err)
			} else {
				foundCampground.comments.push(comment);
				foundCampground.save(function(err,campground) {
					if(err) {
						console.log(err)
					} else {
						console.log(campground)
					}
				})
			}
		})
	}
})
*/



