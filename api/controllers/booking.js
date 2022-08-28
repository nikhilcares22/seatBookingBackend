const Booking = require("../models/booking");
const Seat = require("../models/seat");
const commonUtil = require("../util/common");
const validation = require("../validation");

exports.createBooking = async (req, res) => {
	try {
		await validation.Booking.createBooking.validateAsync(req.body);
		let { user, startTime, endTime, seats, timezone = 0 } = req.body;
		[startTime, endTime] = [new Date(startTime), new Date(endTime)];

		if (startTime == "Invalid Date")
			return res.status(400).json({ message: "Start Time is invalid." });
		if (endTime == "Invalid Date")
			return res.status(400).json({ message: "End Time is invalid." });

		let startTimeLocal = new Date(startTime.getTime() + timezone * 6e4);
		let endTimeLocal = new Date(endTime.getTime() + timezone * 6e4);

		let checkBooking = await Booking.aggregate([
			{
				$match: {
					seat: { $in: seats.map((e) => ObjectId(e)) },
					status: { $nin: ["FINISHED"] },
					$or: [
						{
							$and: [
								{
									startTime: { $gte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $lte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
						{
							$and: [
								{
									startTime: { $gte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $gte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
						{
							$and: [
								{
									startTime: { $lte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $lte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
						{
							$and: [
								{
									startTime: { $lte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $gte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
					],
				},
			},
			{
				$project: {
					startTimeLocal: 1,
					endTimeLocal: 1,
					orderNumber: 1,
					seat: 1,
				},
			},
		]);
		console.log(checkBooking);
		if (checkBooking.length) {
			let seats = checkBooking.reduce((acc, init) => {
				acc = acc + ", " + init.seat;
				return acc;
			}, "");
			return res.status(406).json({
				message: "This seat(s) " + seats + " is/are already booked.",
			});
		}
		let expiry = new Date(new Date().getTime() + 5 * 6e4);
		let orderNumber = commonUtil.generateOrderNumber(6);
		let obj = [];
		seats.forEach((e) => {
			obj.push({
				seat: e,
				orderNumber,
				startTime,
				endTime,
				startTimeLocal,
				endTimeLocal,
				user,
				expiry,
			});
		});

		let booking = await Booking.insertMany(obj);
		return res.status(200).json({
			message: "Booking Created Successfully.",
			booking,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.confirmBooking = async (req, res) => {
	try {
		await validation.Booking.identify.validateAsync(req.body);

		let booking = await Booking.findOne({ _id: req.body.id });
		if (!booking)
			return res.status(200).json({
				message: "Booking Not found.",
			});
		if (!booking.isConfirmed) booking.isConfirmed = 1;
        else return res.status(202).json({message:"Already confirmed"})
		await booking.save();
		return res.status(200).json({
			message: "Booking confirmed Successfully.",
			booking,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.getSeatsForBooking = async (req, res) => {
	try {
		await validation.Booking.getSeatsForBooking.validateAsync(req.body);
		let { user, startTime, endTime, timezone = 0 } = req.body;
		[startTime, endTime] = [new Date(startTime), new Date(endTime)];

		if (startTime == "Invalid Date")
			return res.status(400).json({ message: "Start Time is invalid." });
		if (endTime == "Invalid Date")
			return res.status(400).json({ message: "End Time is invalid." });

		let bookedSeats = await Booking.aggregate([
			{
				$match: {
					status: { $nin: ["FINISHED"] },
					$or: [
						{
							$and: [
								{
									startTime: { $gte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $lte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
						{
							$and: [
								{
									startTime: { $gte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $gte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
						{
							$and: [
								{
									startTime: { $lte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $lte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
						{
							$and: [
								{
									startTime: { $lte: startTime },
								},
								{
									startTime: { $lte: endTime },
								},
								{
									endTime: { $gte: endTime },
								},
								{
									endTime: { $gte: startTime },
								},
							],
						},
					],
				},
			},
			{
				$project: {
					seat: 1,
					_id: 0,
				},
			},
			{
				$group: {
					_id: null,
					bookedSeats: { $push: "$seat" },
				},
			},
			{
				$lookup: {
					from: "seats",
					localField: "bookedSeats",
					foreignField: "_id",
					as: "bookedSeats",
				},
			},
		]);

		let bookedSeatIds = bookedSeats.length
			? bookedSeats[0].bookedSeats
			: [];

		let availableSeats = await Seat.find({ _id: { $nin: bookedSeatIds } });

		let obj = {
			bookedSeats: bookedSeatIds,
			availableSeats,
		};
		return res.status(200).json({
			message: "Seats for booking fetched Successfully.",
			result: obj,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
