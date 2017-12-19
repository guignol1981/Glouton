let passport = require('passport');
let Meal = require('../models/meal/meal');

module.exports.getAll = function (req, res) {
	Meal.find({})
		.populate('cook')	
		.populate('participants')
		.exec((err, meals) => {
			res.send(meals);
		});
};

module.exports.get = function (req, res) {
	let id = req.params.id;

	Meal.findById(id)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
		res.send(meal);
	});
};

module.exports.create = function (req, res) {
	let meal = new Meal(req.body);

	meal.save((err, meal) => {
		if (err) {
			throw err;
		}
		res.send(meal);
	});
};

module.exports.join = function (req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId, (err, meal) => {
		meal.participants.push(req.body);
		meal.save((err, meal) => {
			if (err) {
				throw err;
			}
			res.send(meal);
		});
	});
};
