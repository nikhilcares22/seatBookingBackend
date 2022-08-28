const User = require("../models/user");
const validation = require("../validation/");

exports.user_signup = async (req, res) => {
	try {
		await validation.User.register.validateAsync(req.body);
		let { phoneNo, email, name } = req.body;
		let user = await User.find({
			$or: [{ phoneNo: phoneNo }, { email: email }],
		});
		if (user.length) {
			return res.status(409).json({
				message: "User already exists",
			});
		}

		user = new User({
			_id: ObjectId(),
			email: email,
			phoneNo: phoneNo,
			name: name,
		});
		let result = await user.save();
		res.status(201).json({
			message: "User created",
			result,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error,
		});
	}
};
exports.user_edit = async (req, res) => {
	try {
		await validation.User.edit.validateAsync(req.body);
		await validation.User.identify.validateAsync(req.params);
		let { phoneNo, email, name } = req.body;
		let user = await User.find({
			$and: [
				{ _id: { $ne: ObjectId(req.params.id) } },
				{ $or: [{ phoneNo: phoneNo }, { email: email }] },
			],
		});
		if (user.length) {
			return res.status(409).json({
				message: "User with same email or phone number already exists",
			});
		}

		let updateObj = {};
		phoneNo ? (updateObj.phoneNo = req.body.phoneNo) : 0;
		email ? (updateObj.email = req.body.email) : 0;
		name ? (updateObj.name = req.body.name) : 0;
		console.log(updateObj);
		await User.updateOne({ _id: ObjectId(req.params.id) }, updateObj);

		res.status(201).json({
			message: "User updated",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error,
		});
	}
};
exports.user_delete = async (req, res) => {
	try {
        await validation.User.identify.validateAsync(req.params);
		let checkUser = await User.findOne({ _id: ObjectId(req.params.id) });
		if (!checkUser)
			return res.status(400).json({
				message: "User does not exist.",
			});

		let result = await User.deleteOne({ _id: ObjectId(req.params.id) });
		return res.status(200).json({
			message: "user deleted",
			result,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};
exports.getAllUsers = async (req, res) => {
	try {
		let users = await User.find();
		return res.status(200).json({
			message: "Users fetched",
			users,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.getUser = async (req, res) => {
	try {
        await validation.User.identify.validateAsync(req.params);
		let user = await User.findOne({_id:ObjectId(req.params.id)});
        if(!user)return res.status(200).json({
            message:"User Not Found"
        })
		return res.status(200).json({
			message: "User fetched",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};