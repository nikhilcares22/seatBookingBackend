module.exports.generateSeatNumber = function (floor, lastSeatNumber) {
	return `${floor}-${Number(lastSeatNumber) + 1}`;
};
module.exports.generateOrderNumber = function (a) {
	return Math.random()
		.toString(16)
		.substring(2, 2 + Number(a));
};
