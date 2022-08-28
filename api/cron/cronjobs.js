const cron = require("node-cron");
const Booking = require("../models/booking");

module.exports.everyMinute = async () => {
	cron.schedule("* * * * *", async () => {
		try {
			let result = await Booking.deleteMany({
				isConfirmed: 0,
				expiry: { $lt: new Date() },
			});
            console.log('cron=',result)
		} catch (error) {
			console.error(error);
		}
	});
};
