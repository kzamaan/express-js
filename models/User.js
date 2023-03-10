const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	username: String,
	password: String,
	profile_photo_path: String,
	email_verified_at: Date,
	remember_token: String,
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('User', userSchema);
