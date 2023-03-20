const mongoose = require('mongoose');

(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
		console.log('MongoDB connected');
	} catch (err) {
		console.log(err);
	}
})();
