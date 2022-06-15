const catchAsync     = require("../utilities/catchAsync.js"),
	  ExpressError   = require("../utilities/ExpressError.js"),
	  Campground     = require("../models/campground.js"),
	  Comment        = require("../models/comment.js"),
	  Joi            = require("joi")

const middlewareObject = {};

middlewareObject.isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()) {
		return next()
	}
	req.flash("error", "You must be signed in to do that!")
	req.session.returnTo = req.originalUrl
	res.redirect("/login")
}

middlewareObject.isCampgroundAuthor = catchAsync(async(req,res,next) => {
	const foundCampground = await Campground.findById(req.params.id)
	if(!foundCampground) {
		throw new ExpressError("Campground not found", 404)
	}
	if(!foundCampground.author._id.equals(req.user._id)) {
		req.flash("error", "You are unauthorized to do that!")
		return res.redirect("/campgrounds/"+req.params.id)
	}
	next()
})

middlewareObject.isCommentAuthor = catchAsync(async(req,res,next) => {
	const foundCampground = await Campground.findById(req.params.id)
	if(!foundCampground) {
		throw new ExpressError("Campground not found", 404)
	}
	const foundComment = await Comment.findById(req.params.comment_id)
	if(!foundComment) {
		throw new ExpressError("Comment not found", 404)
	}
	if(!foundComment.author._id.equals(req.user._id)) {
		req.flash("error", "You are unauthorized to do that!")
		return res.redirect("/campgrounds/"+req.params.id)
	}
	next()
})

middlewareObject.validateCampground = (req,res,next) => {
	const campgroundSchema = Joi.object({
		name: Joi.string().required().max(18).pattern(new RegExp("[a-zA-Z0-9][a-zA-Z0-9'\s]*")).messages({
			"string.empty": "Please enter campground's name.",
			"string.max": "Campground name must be less than or equal to 18 characters long.",
			"string.pattern.base": "Only letters (a-z or A-Z), numbers (0-9), spaces and apostrophe (') are allowed. First character cannot be space."
		}),
		image: Joi.string().required().regex(/^https:\/\/.+[|]*/).messages({
			"string.empty": "Image URL is required.",
			"string.pattern.base": "Please enter a valid https:// URL."
		}),
		price: Joi.string().required().regex(/^([1-9])$|^([1-9][0-9])$/).messages({
			"string.empty": "Price is required.",
			"string.pattern.base": "Please enter price between $1 and $99."
		}),
		description: Joi.string().required().max(1500).messages({
			"string.empty": "Description is required.",
			"string.max": "Description must be less than or equal to 1500 characters long."
		})
	})
	const {error} = campgroundSchema.validate(req.body)
	if(error) {
		const msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg,400)
	} else {
		next()
	}
}

middlewareObject.validateComment = (req,res,next) => {
	const commentSchema = Joi.object({
		comment: Joi.object({
			text: Joi.string().required().max(500).messages({	
				"string.empty": "Please enter the comment.",
				"string.max": "Comment must be less than or equal to 500 characters long."
			})			
		})
	})
	const {error} = commentSchema.validate(req.body)
	if(error) {
		const msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg,400)
	} else {
		next()
	}
}

middlewareObject.validateUserRegistration = (req,res,next) => {
	const userSchema = Joi.object({
		username: Joi.string().required().min(3).max(16).regex(/^[a-zA-Z0-9_]*$/).messages({
			"string.empty": "Username is required.",
			"string.min": "Username must be atleast 3 characters long.",
			"string.max": "Username must be less than or equal to 16 characters long.",
			"string.pattern.base": "Only letters (a-z or A-Z), numbers (0-9) and underscore (_) are allowed."
		}),
		email: Joi.string().required()
.regex(/^(.+@hotmail\.com)$|^(.+@outlook\.com)$|^(.+@gmail\.com)$|^(.+@yahoo\.com)$/).messages({
			"string.empty": "Email address is required.",
			"string.pattern.base": "Please enter a valid email address. Domains allowed: hotmail.com/outlook.com/gmail.com/yahoo.com"
		}),
		password: Joi.string().required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/).messages({
			"string.empty": "Password is required.",
			"string.pattern.base": "Password must contain atleast 6 characters, including one uppercase and one lowercase letter, and one number."
		})
	})
	const {error} = userSchema.validate(req.body)
	if(error) {
		const msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg,400)
	} else {
		next()
	}
}

middlewareObject.validateUserLogin = (req,res,next) => {
	const userSchema = Joi.object({
		username: Joi.string().required().min(3).max(16).regex(/^[a-zA-Z0-9_]*$/).messages({
			"string.empty": "Username is required.",
			"string.min": "Username must be atleast 3 characters long.",
			"string.max": "Username must be less than or equal to 16 characters long.",
			"string.pattern.base": "Only letters (a-z or A-Z), numbers (0-9) and underscore (_) are allowed."
		}),
		password: Joi.string().required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/).messages({
			"string.empty": "Password is required.",
			"string.pattern.base": "Password must contain atleast 6 characters, including one uppercase and one lowercase letter, and one number."
		})
	})
	const {error} = userSchema.validate(req.body)
	if(error) {
		const msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg,400)
	} else {
		next()
	}
}

module.exports = middlewareObject
















