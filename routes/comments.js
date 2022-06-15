const express        = require("express"),
      router         = express.Router({mergeParams: true}),
	  Joi            = require("joi"),
      Campground     = require("../models/campground.js"),
	  Comment        = require("../models/comment.js"),
	  ExpressError   = require("../utilities/ExpressError.js"),
	  catchAsync     = require("../utilities/catchAsync.js"),
      mw             = require("../middlewares/middlewares.js")

//NEW ROUTE
router.get("/new",mw.isLoggedIn,catchAsync(async(req,res) => {
	const foundCampground = await Campground.findById(req.params.id)
	if(!foundCampground) {
		throw new ExpressError("Campground not found", 404)
	}
	res.render("comments/new",{campground: foundCampground})
}))

//CREATE ROUTE
router.post("/",mw.isLoggedIn,mw.validateComment,catchAsync(async(req,res) => {
	const foundCampground = await Campground.findById(req.params.id)
	if(!foundCampground) {
		throw new ExpressError("Campground not found", 404)
	}
	const comment = await Comment.create(req.body.comment)
	//add id to comment
	comment.author = req.user._id;
	//save comment
	await comment.save()
	foundCampground.comments.push(comment);
	await foundCampground.save()
	res.redirect("/campgrounds/"+req.params.id)
}))

// EDIT ROUTE
router.get("/:comment_id/edit",mw.isLoggedIn,mw.isCommentAuthor,catchAsync(async(req,res) => {
	const foundCampground = await Campground.findById(req.params.id)
    const foundComment = await Comment.findById(req.params.comment_id)
	res.render("comments/edit", {campground: foundCampground, comment: foundComment})
}))

// UPDATE ROUTE
router.put("/:comment_id",mw.isLoggedIn,mw.isCommentAuthor,mw.validateComment,catchAsync(async(req,res) => {
	await Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment)
	res.redirect("/campgrounds/"+req.params.id)
}))

// DESTROY ROUTE
router.delete("/:comment_id",mw.isLoggedIn,mw.isCommentAuthor,catchAsync(async(req,res) => {
	await Comment.findByIdAndRemove(req.params.comment_id)
	res.redirect("/campgrounds/"+req.params.id)
}))

module.exports = router;
	
	
	
	