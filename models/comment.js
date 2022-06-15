const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	text: String,
	created: {type: Date, default: Date.now},
	author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
	},
});

module.exports = mongoose.model("Comment",commentSchema);


