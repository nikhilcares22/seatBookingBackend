const readUtil = require("../util/readUtil");
const writeUtil = require("../util/writeUtil");

exports.findAll = async (db) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await readUtil.readDb(db);
			return resolve(data);
		} catch (error) {
			console.log(error);
			return reject(error);
		}
	});
};
exports.findOne = async (db, criteria) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await readUtil.readDb(db);
			let key;
			if (criteria.hasOwnProperty("isbn")) key = "isbn";
			if (criteria.hasOwnProperty("author")) key = "author";

			let res = data.find((elem) => {
				if (key == "isbn") {
					return elem[key] == criteria["isbn"];
				}
				if (key == "author") {
					return elem["authors"].includes(criteria["author"]);
				}
			});
			if (!res) res = [];
			return resolve(res);
		} catch (error) {
			console.log(error);
			return reject(error);
		}
	});
};
