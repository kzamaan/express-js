const mongoose = require('mongoose');

(async () => {
	const connectionStr = process.env.MONGO_URI;
	mongoose.set('strictQuery', true);
	try {
		await mongoose.connect(connectionStr, { useNewUrlParser: true });
		console.log('MongoDB connected');
	} catch (err) {
		console.log(err);
	}
})();
