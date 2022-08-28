const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema(
	{
		email: { type: String, default: "", index: true },
		phoneNo: { type: String, default: "" },
		name: { type: String, default: "" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Users", DocSchema);
