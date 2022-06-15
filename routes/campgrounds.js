const express        = require("express"),
      router         = express.Router(),
	  Joi            = require("joi"),
	  fuzzySearch    = require("fuzzy-search"),
	  Campground     = require("../models/campground.js"),
	  Comment        = require("../models/comment.js"),
	  ExpressError   = require("../utilities/ExpressError.js"),
      catchAsync     = require("../utilities/catchAsync.js"),
	  mw             = require("../middlewares/middlewares.js")


//INDEX ROUTE
router.get("/",catchAsync(async(req,res) => {
	if(req.query.search) {
		const allCampgrounds = await Campground.find({})
		const searcher = new fuzzySearch(allCampgrounds, ['name'], {
		caseSensitive: false,
		});
		const searchedCampgrounds = searcher.search(req.query.search);
		const perPage = 12;
		const page = req.query.page || 1;
		req.session.page = page
		req.session.search = req.query.search
		const total = searchedCampgrounds.length
		const totalPages = Math.ceil(total/perPage);
		//Number of searched campgrounds skipped on each page will be perPage*(page-1) and number of                 campgrounds limit on each page is 12.
		var perPageCampgrounds = searchedCampgrounds.splice(perPage*(page-1),12)
		res.render("campgrounds/index",{
			campgrounds: perPageCampgrounds,
			search: req.query.search,
			pages: totalPages,
			page: page
		});
	} else {
		//We want to display 12 campgrounds per page
		const perPage = 12;
		//page variable stores page number in query string. || is used so that in case we trigger                     /campgrounds page number will be 1, also by default first page is 0 but this will make first page to         be 1.
		const page = req.query.page || 1;
		//page variable is saved in session so that we can redirect to this page after deleting campground.           We will need to access this variable in destroy route. 
		req.session.page = page
		//req.session.search that was saved in first portion of route is deleted here so that if user first           uses search feature then just goes to /campgrounds and delete a campground, then in that case nothing         should be saved in req.session.search else our destroy route logic will get disturbed.
		delete req.session.search
		//Following method will count total campground documents
		const total = await Campground.countDocuments({});
		//Following method will calculate total number of pages. Math.ceil() function rounds a number up to           the next largest integer
		const totalPages = Math.ceil(total/perPage);
		//.limit() will limit the number of items per page. .skip() skips the specified number of documents           on a page. Following code will skip 0 docs on page 1, 12 docs on page 2 and so on.
		const allCampgrounds = await Campground.find({}).limit(perPage).skip(perPage*(page-1))
		res.render("campgrounds/index",{
			campgrounds: allCampgrounds,
			search: req.query.search,
			pages: totalPages,
			page: page
		});
	}
}))


//NEW ROUTE
router.get("/new",mw.isLoggedIn,(req,res) => {
	res.render("campgrounds/new")
})


//CREATE ROUTE
router.post("/",mw.isLoggedIn,mw.validateCampground,catchAsync(async(req,res) => {
	let name = req.body.name;
	let image = req.body.image;
	let price = req.body.price;
	let desc = req.body.description;
	let author = req.user._id
	await Campground.create({
		name: name,
		image: image,
		price: price,
		description: desc,
		author: author
	})
	const total = await Campground.countDocuments({});
	const perPage = 12;
	const totalPages = Math.ceil(total/perPage);
	res.redirect("/campgrounds/?page="+totalPages)
}))


//SHOW ROUTE
router.get("/:id",catchAsync(async(req,res) => {
	const foundCampground = await Campground.findById(req.params.id).populate({
		path: "comments",
		populate: {
			path: "author"
		}
	})
		.populate("author").exec()
	if(!foundCampground) {
		throw new ExpressError("Campground not found", 404)
	}
	res.render("campgrounds/show",{campground: foundCampground})		
}))


//EDIT ROUTE
router.get("/:id/edit",mw.isLoggedIn,mw.isCampgroundAuthor,catchAsync(async(req,res) => {
	const foundCampground = await Campground.findById(req.params.id)
	res.render("campgrounds/edit",{campground: foundCampground})
}))


//UPADTE ROUTE
router.put("/:id",mw.isLoggedIn,mw.isCampgroundAuthor,mw.validateCampground,catchAsync(async(req,res) => {
	let newData = {
		name: req.body.name,
		image: req.body.image,
		price: req.body.price,
		description: req.body.description
	}
	await Campground.findByIdAndUpdate(req.params.id,newData)
	res.redirect("/campgrounds/"+req.params.id)
}))


//DESTROY ROUTE
router.delete("/:id",mw.isLoggedIn,mw.isCampgroundAuthor,catchAsync(async(req,res) => {
/* made modifications to destroy route so that when we delete any campground, all the comments associated with it also get delete. If we don't do this, all the comments for the deleted campground will remain in the database.*/
	const foundCampground = await Campground.findById(req.params.id)
	await Comment.deleteMany({
		"_id": {
			$in: foundCampground.comments
		}
	})
	await foundCampground.deleteOne()
	//after deleting we will again count total documents to find new total number of pages
	const total = await Campground.countDocuments({});
	const perPage = 12;
	const totalPages = Math.ceil(total/perPage);
	//page variable was stored in session in index route 
	const page = req.session.page
	delete req.session.page
	const search = req.session.search
	delete req.session.search
	if(search) {
		res.redirect("/campgrounds")			
	} else {
		if(page<=totalPages) {
			res.redirect("/campgrounds/?page="+page)
		} else {
			res.redirect("/campgrounds/?page="+totalPages)
		}	
	}
}))

module.exports = router;