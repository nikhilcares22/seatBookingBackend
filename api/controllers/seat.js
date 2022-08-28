const Seat = require("../models/seat");
const mongoose = require("mongoose");
const validation = require("../validation");
const commonUtil = require("../util/common");

exports.addSeat = async (req, res) => {
	try {
		await validation.Seat.addSeat.validateAsync(req.body);
		let { numberOfSeats, seatNumber, floor } = req.body;
		let arrayToBeInserted = [];
		let lastSeat = await Seat.aggregate([
			{ $match: { floor: floor } },
			{
				$project: {
					lastSeatNumber: {
						$toInt: {
							$arrayElemAt: [
								{
									$split: ["$seatNumber", "-"],
								},
								-1,
							],
						},
					},
				},
			},
			{ $sort: { lastSeatNumber: -1 } },
			{ $limit: 1 },
		]);
		let lastSeatNumber = 0;
		if (lastSeat.length) lastSeatNumber = lastSeat[0].lastSeatNumber;
		for (i = 0; i < numberOfSeats; i++) {
			seatNumber = commonUtil.generateSeatNumber(floor, lastSeatNumber);
			arrayToBeInserted[i] = {};
			arrayToBeInserted[i]["seatNumber"] = seatNumber;
			arrayToBeInserted[i]["floor"] = floor;
			lastSeatNumber++;
		}
		let result = await Seat.insertMany(arrayToBeInserted);
		return res.status(201).json({
			message: "Seat(s) added successfully",
			result,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
exports.getAllSeats = async (req, res) => {
	try {
		await validation.Seat.getAllSeats.validateAsync(req.body);
		let { floor } = req.body;
		let obj = {};
		if (floor) obj.floor = floor;
		let seats = await Seat.find(obj, { createdAt: 0, updatedAt: 0, __v: 0 });
		return res.status(200).json({
			message: "Seats fetched",
			seats,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.getOneSeat = async (req, res) => {
	try {
		await validation.Seat.identify.validateAsync(req.params);
		let seat = await Seat.find({ _id: ObjectId(req.params.id) });
		return res.status(200).json({
			message: "Seat fetched",
			seat,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.deleteSeats = async (req, res) => {
	try {
		await validation.Seat.deleteSeats.validateAsync(
			Object.assign(req.body, { id: req.params.id })
		);
		let { id, floor } = req.body;
		let obj = {};
		id ? (obj["_id"] = ObjectId(id)) : 0;
		floor ? (obj["floor"] = floor) : 0;
		console.log(obj);
		let result = await Seat.deleteMany(obj);
		if (!result.deletedCount)
			return res.status(200).json({
				message: "No Seats found",
			});
		return res.status(200).json({
			message: "Seat deleted",
			result,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.getSeatsByFloor = async (req, res) => {
	try {
		await validation.Seat.getSeatsByFloor.validateAsync(req.body);
		let pipeline = [
			{
				$group: {
					_id: "$floor",
					seats: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					_id: 0,
					floor: "$_id",
					seats: 1,
				},
			},
		];
        if(req.body.floor)
            pipeline.push({$match:{floor:Number(req.body.floor)}})
		let seatsByFloor = await Seat.aggregate(pipeline);
		return res
			.status(200)
			.json({ message: "Seats fetched successfully", seatsByFloor });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
