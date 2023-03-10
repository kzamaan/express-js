const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	youtubeID: String,
	title: String,
	noq: String,
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Video', schema);
