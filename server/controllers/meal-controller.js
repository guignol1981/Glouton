let Meal = require('../models/meal/meal');
let User = require('../models/user/user');
let Message = require('../models/message/message');

module.exports.get = function (req, res) {
	let id = req.params.id;

	Meal.findById(id)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
			res.send(meal);
		});
};

module.exports.getAll = function (req, res) {
	Meal.find({status: 'active'})
		.populate('cook')
		.populate('participants')
		.exec((err, meals) => {
			res.send(meals);
		});
};

module.exports.update = function(req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId).populate('cook').populate('participants').exec((err, meal) => {
		meal.title = req.body.title;
		meal.description = req.body.description;
		meal.date = req.body.date;
		meal.limitDate = req.body.limitDate;
		meal.minParticipants = req.body.minParticipants;
		meal.maxParticipants = req.body.maxParticipants;
		meal.save((err, savedMeal) => {
			res.send(savedMeal);
		});
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
	//hack without this it will force the _id to null
	delete req.body._id;
	let newMeal = new Meal(req.body);

	newMeal.save((err, doc) => {
		Meal.populate(doc, {path: "cook"}, (err, book) => res.send(book));
	});
};

module.exports.join = function (req, res) {
	let mealId = req.params.id;
	let userId = req.payload._id;


	Meal.findById(mealId)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
			meal.addParticipant(userId);
			meal.save((err, meal) => {
				User.findById(userId, (err, user) => {
					User.findById(meal.cook, (err, cook) => {
						Message.create({
							recipient: cook._id,
							title: `${user.name} has joined your meal ${meal.title}`,
							body: `Hey good news ${cook.name}, someone just joined your meal. 
							This mean only ${meal.minParticipants - meal.participants.length} more participants are needed to confirm the meal before
							${meal.limitDate}`,
							creationDate: Date.now(),
							type: 'info'
						});

						res.send(meal);
					});
				});
			});
		});
};

module.exports.leave = function (req, res) {
	let mealId = req.params.id;
	let userId = req.payload._id;

	Meal.findById(mealId)
		.populate('cook')
		.exec((err, meal) => {
			meal.removeParticipants(userId);
			meal.save((err, meal) => {
				res.send(meal);
			});
		});
};
