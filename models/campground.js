const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
	name: String,
    image: String,
	price: Number,
	description: String,
	author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
	},
	created: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground",campgroundSchema);



