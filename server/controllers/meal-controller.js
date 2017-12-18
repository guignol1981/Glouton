let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Meal = mongoose.model('Meal');

module.exports.getAll = function (req, res) {
	Meal.find({}, (err, meals) => {
		if (err) {
			throw err;
		}
		res.send(meals);
	});
};

module.exports.get = function (req, res) {
	let id = req.params.id;

	Meal.findById(id, (err, meal) => {
		if (err) {
			throw err;
		}

		res.send(meal);
	});
};

module.exports.create = function (req, res) {
	let meal = new Meal({
		title: req.body.title,
		description: req.body.description,
		date: req.body.date,
		minParticipants: req.body.minParticipants
	});

	User.findById(req.body.cook['_id'], (err, user) => {
		meal.cook = user._id;

		let participantIds = [];
		req.body.participants.forEach(function (participant) {
			participantIds.push(participant._id);
		});

		User.find({_id: {"$in": participantIds}}, (err, users) => {
			meal.participants = users;

			meal.save((err, meal) => {
				if (err) {
					throw err;
				}
				res.send(meal);
			});
		});
	});
};

module.exports.join = function (req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId, (err, meal) => {
		User.findById(req.body._id, (err, user) => {
			meal.participants.push(user);
			meal.save((err, meal) => {
				if (err) {
					throw err;
				}
				res.send(meal);
			});
		});
	});
};
