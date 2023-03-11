const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	id: Number,
	name: String,
	mobile: String,
	address: String,
	e_tin: String,
	tin_date: Date,
	police_station: String,
	circle_name: Date,
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Contact', schema);
