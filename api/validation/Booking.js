const Joi = require("joi");

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.identify = Joi.object({
	id: Joi.objectId().required(),
});

module.exports.createBooking = Joi.object({
	user: Joi.objectId().required(),
	seats: Joi.array().items(Joi.objectId()).required(),
	startTime: Joi.date().required(),
	timezone: Joi.number().optional(),
	endTime: Joi.date().required()
});

module.exports.getSeatsForBooking = Joi.object({
	user: Joi.objectId().required(),
	startTime: Joi.date().required(),
	timezone: Joi.number().optional(),
	endTime: Joi.date().required()
});