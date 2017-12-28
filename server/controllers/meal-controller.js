let Meal = require('../models/meal/meal');
let User = require('../models/user/user');
let Message = require('../models/message/message');

let handleError = function (err, res, callback) {
	if (err) {
		res.status(500).json(err);
	} else {
		callback();
	}
};

module.exports.get = function (req, res) {
	let id = req.params.id;

	Meal.findById(id)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
			handleError(err, res, () => res.send(meal));
		});
};

module.exports.getAll = function (req, res) {
	Meal.find({status: 'active'})
		.populate('cook')
		.populate('participants')
		.exec((err, meals) => {
			handleError(err, res, () => res.send(meals));
		});
};

module.exports.update = function (req, res) {
	let mealId = req.params.id;

	Meal.findById(mealId).populate('cook').populate('participants').exec((err, meal) => {
		handleError(err, res, () => {
			meal.title = req.body['title'];
			meal.description = req.body['description'];
			meal.date = req.body['date'];
			meal.limitDate = req.body['limitDate'];
			meal.minParticipants = req.body['minParticipants'];
			meal.maxParticipants = req.body['maxParticipants'];
			meal.participants.forEach(participant => {
				Message.create({
					recipient: participant._id,
					title: `${participant.name} the meal ${meal.title} edited`,
					body: `we removed you from participants list`,
					creationDate: Date.now(),
					type: 'danger'
				});
			});
			meal.participants = [];
			meal.save((err, savedMeal) => {
				handleError(err, res, () => res.send(savedMeal));
			});
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
			handleError(err, res, () => {
				meals.forEach((meal) => {
					meal.participants.forEach((participant) => {
						if (participant.id === userId) {
							joined.push(meal);
						}
					});
				});
				res.send(joined);
			});
		});
};

module.exports.create = function (req, res) {
	//hack without this it will force the _id to null
	delete req.body._id;
	let newMeal = new Meal(req.body);
	let errors = [];

	if (newMeal.date <= newMeal.limitDate) {
		errors.push('limit date should be lower than delivery date');
	}

	if (newMeal.minParticipants > newMeal.maxParticipants) {
		errors.push('min participants count should be lower or equal than maximum participants count');
	}

	if (errors.length > 0) {
		res.send(500).json({msg: errors});
	}

	newMeal.save((err, doc) => {
		handleError(err, res, () => {
			Meal.populate(doc, {path: "cook"}, (err, book) => res.send(book));
		});
	});
};

module.exports.join = function (req, res) {
	let mealId = req.params.id;
	let userId = req.payload._id;

	Meal.findById(mealId)
		.populate('cook')
		.populate('participants')
		.exec((err, meal) => {
			handleError(err, res, () => {
				meal.addParticipant(userId);
				meal.save((err, meal) => {
					handleError(err, res, () => {
						User.findById(userId, (err, user) => {
							handleError(err, res, () => {
								User.findById(meal.cook, (err, cook) => {
									handleError(err, res, () => {
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
			handleError(err, res, () => {
				meal.removeParticipants(userId);
				meal.save((err, meal) => {
					handleError(err, res, () => res.send(meal));
					res.send(meal);
				});
			});
		});
};
