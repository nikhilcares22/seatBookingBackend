const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema(
	{
		user: { type: ObjectId, ref: "users", index: true },
		orderNumber: { type: String },
		seat: { type: ObjectId, ref: "seats", index: true },
		startTime: { type: Date, default: 0 },
		endTime: { type: Date, default: 0 },
		startTimeLocal: { type: Date, default: 0 },
		endTimeLocal: { type: Date, default: 0 },
		isConfirmed: { type: Number, default: 0 },
		expiry: { type: Date, default: 0 },
		timezone: { type: Number, default: 0 },
		status: {
			type: String,
			default: "INITIATED",
			enum: [
				"INITIATED",
				"APPROVED",
				"REJECTED",
				"PROCESSED",
				"FINISHED",
				"PENDING",
			],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Bookings", DocSchema);
