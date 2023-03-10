const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	questions: mongoose.Schema.Types.Mixed,
	youtubeID: String,
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Quiz', schema);
