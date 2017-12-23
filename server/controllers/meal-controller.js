let User = require('../models/user/user');
let Meal = require('../models/meal/meal');

module.exports.get = function (req, res) {
	let id = req.params.id;

	Meal.findById(id)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
			res.send(meal);
		});
};

module.exports.update = function (req, res) {
	let id = req.params.id;

	Meal.findById(id, (err, meal) => {
		if (err) {
			throw err;
		}
		if (meal.cook != req.payload._id) {
			res.status(500).json({msg: 'only meal cook can edit'});
			return;
		}

		meal.title = req.body.title;
		meal.description = req.body.description;
		meal.date = req.body.date;
		meal.limitDate = req.body.limitDate;
		meal.minParticipants = req.body.minParticipants;
		meal.maxParticipants = req.body.maxParticipants;
		meal.imageUrl = req.body.imageUrl;

		meal.save((err, meal) => {
			if (err) {
				throw err;
			}

			res.send(meal);
		})
	})
};

module.exports.getAll = function (req, res) {
	Meal.find({})
		.populate('cook')
		.populate('participants')
		.exec((err, meals) => {
			res.send(meals);
		});
};

module.exports.getJoined = function (req, res) {
	let userId = req.payload._id;
	let joined = [];

	Meal.find({})
		.populate('cook')
		.populate('participants')
		.exec((err, meals) => {
			meals.forEach((meal) => {
				meal.participants.forEach((participant) => {
					if (participant.id === userId) {
						joined.push(meal);
					}
				});
			});
			res.send(joined);
		});
};

module.exports.create = function (req, res) {
	delete req.body._id;

	let meal = new Meal(req.body);

	meal.save((err, doc) => {
		if (err) {
			throw err;
		}
		res.send(doc);
	});
};

module.exports.join = function (req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
			let exist = false;
			let userId = req.payload._id;

			meal.participants.forEach((participant) => {
				if (participant._id == userId) {
					exist = true;
				}
			});

			if (exist) {
				res.status(500).json({msg: 'user already joined this meal'});
				return;
			}

			meal.participants.push(userId);
			meal.save((err, meal) => {
				if (err) {
					throw err;
				}

				res.send(meal);
			});
		});
};

module.exports.leave = function (req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId)
		.populate('cook')
		.exec((err, meal) => {
			let userId = req.payload._id;

			let index = meal.participants.indexOf(userId);
			if (index === -1) {
				res.status(500).json({msg: 'user dit not already joined this meal'});
				return;
			}

			meal.participants.splice(index, 1);
			meal.save((err, meal) => {
				if (err) {
					throw err;
				}

				res.send(meal);
			});
		});
};