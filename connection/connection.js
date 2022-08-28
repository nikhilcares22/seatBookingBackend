const mongoose = require("mongoose");
global.ObjectId = mongoose.Types.ObjectId;

module.exports.mongodb = async () => {
	await mongoose.connect(
		"mongodb://localhost:27017/SeatBooking",
		{
			useUnifiedTopology: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useCreateIndex: true,
		},
		(error, result) => {
			error ? console.error("Mongo", error) : console.log("Mongo Connected");
		}
	);
};
