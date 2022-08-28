const Joi = require("joi");

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.identify = Joi.object({
	id: Joi.objectId().required(),
});

module.exports.addSeat = Joi.object({
	floor: Joi.number().required(),
	numberOfSeats: Joi.number().optional(),
});
module.exports.getAllSeats = Joi.object({
	floor: Joi.number().optional(),
});
module.exports.deleteSeats = Joi.object({
	id: Joi.objectId().optional(),
	floor: Joi.number().optional(),
}).xor("id","floor");
module.exports.getSeatsByFloor = Joi.object({
	floor: Joi.number().optional(),
});
