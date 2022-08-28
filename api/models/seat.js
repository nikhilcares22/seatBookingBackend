const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema(
	{
		floor: { type: Number, default: 0 },
		seatNumber: { type: String, default: "" }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Seats", DocSchema);
