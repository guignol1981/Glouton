let Meal = require('../models/meal/meal');
let User = require('../models/user/user');
let Message = require('../models/message/message');

module.exports.get = function (req, res) {
	let id = req.params.id;

	Meal.findById(id).populate('cook').populate('participants').exec()
		.then(meal => {
			res.send(meal)
		});
};

module.exports.getAll = function (req, res) {
	Meal.getList(meals => {
		res.send(meals)
	});
};

module.exports.update = function (req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId).populate('cook').populate('participants').exec().then(meal => {
		meal.title = req.body['title'];
		meal.description = req.body['description'];
		meal.deliveryDate = req.body['deliveryDate'];
		meal.limitDate = req.body['limitDate'];
		meal.minParticipants = req.body['minParticipants'];
		meal.maxParticipants = req.body['maxParticipants'];
		meal.participants.forEach(participant => {
			Message.create({
				recipient: participant._id,
				title: `${participant.name} Some modification has been made to the lunch proposition ${meal.title}`,
				type: 'message-meal-rejected-from',
				category: 'warning',
				data: {
					meal: meal
				}
			});
		});
		meal.participants = [];
		meal.save().then(updatedMeal => {
			res.send(updatedMeal);
		});
	});
};

module.exports.getLunchBox = function (req, res) {
	let userId = req.payload._id;

	Meal.getLunchBox(userId, (meals) => {
		res.send(meals);
	});
};

module.exports.create = function (req, res) {
	//hack without this it will force the _id to null
	delete req.body._id;
	let newMeal = new Meal(req.body);
	let errors = [];

	if (newMeal.deliveryDate <= newMeal.limitDate) {
		errors.push('limit date should be lower than delivery date');
	}

	if (newMeal.minParticipants > newMeal.maxParticipants) {
		errors.push('min participants count should be lower or equal than maximum participants count');
	}

	if (errors.length > 0) {
		res.send(500).json({msg: errors});
		return;
	}

	newMeal.save().then(meal => {
		Meal.populate(meal, {path: "cook"}).then(cook => res.send(cook));
	});
};

module.exports.join = function (req, res) {
	let mealId = req.params.id;
	let userId = req.payload._id;

	Meal.findById(mealId)
		.populate('cook')
		.populate('participants').exec()
		.then(meal => {
			meal.addParticipant(userId);
			meal.save()
				.then(meal => {
					User.findById(userId).exec()
						.then(user => {
							User.findById(meal.cook).exec()
								.then((cook) => {
									Message.create({
										recipient: cook._id,
										title: `${user.name} has joined your meal ${meal.title}`,
										type: 'message-meal-join',
										category: 'success',
										data: {
											meal: meal,
											joinedBy: user,
										}
									});
									Meal.populate(meal, {path: "participants"}).then(meal => res.send(meal));
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
		.exec().then(meal => {
		meal.removeParticipants(userId);
		meal.save().then(meal => {
			Meal.populate(meal, {path: "participants"}).then(meal => res.send(meal));
		});
	});
};
