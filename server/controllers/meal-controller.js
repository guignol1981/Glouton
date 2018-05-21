let Lunch = require('../models/lunch');
let User = require('../models/user');
let Group = require('../models/group');
let Message = require('../models/message');
let moment = require('moment');
let dateHelper = require('../services/date-helper');

module.exports.get = function(req, res) {
	let id = req.params.id;

	Lunch.findById(id)
		.populate('cook')
		.populate('group')
		.populate('participants')
		.exec()
		.then(lunch => {
			res.send(lunch);
		});
};

module.exports.getAll = function(req, res) {
	let userId = req.payload._id;

	let userGroups = [];

	Group.getOwned(userId, (ownedGroups) => {
		userGroups = ownedGroups;
		Group.getJoined(userId, (joinedGroups) => {
			userGroups.concat(joinedGroups);
			Lunch.getList(userGroups, lunchs => {
				res.send(lunchs);
			});
		});
	});
};

module.exports.update = function(req, res) {
	let lunchId = req.params.id;

	Lunch.findById(lunchId).populate('cook').populate('participants').exec().then(lunch => {
		let removeParticipants = false;

		if (
			dateHelper.compareDates(lunch.deliveryDate, req.body['deliveryDate']) !== 0
			||
			dateHelper.compareDates(lunch.limitDate, req.body['limitDate'] !== 0
				||
				lunch.contribution !== req.body['contribution']
			)
		) {
			removeParticipants = true;
		}

		lunch.title = req.body['title'];
		lunch.description = req.body['description'];
		lunch.deliveryDate = moment(req.body['deliveryDate']).startOf('day').toDate();
		lunch.limitDate = moment(req.body['limitDate']).endOf('day').toDate();
		lunch.deliveryHour = req.body['deliveryHour'];
		lunch.minParticipants = req.body['minParticipants'];
		lunch.maxParticipants = req.body['maxParticipants'];
		lunch.contribution = req.body['contribution'];
		lunch.type = req.body['type'];

		if (removeParticipants) {
			lunch.participants.forEach(participant => {
				Message.create({
					recipient: participant._id,
					title: `${participant.name} Some modification has been made to the lunch proposition ${lunch.title}`,
					type: 'message-lunch-rejected-from',
					category: 'warning',
					data: {
						lunch: lunch
					}
				});
			});

			lunch.participants = [];
		}

		lunch.save().then(updatedLunch => {
			Lunch.populate(updatedLunch, {path: "group"}).then(lunch => res.send(lunch));
		});
	});
};

module.exports.getLunchBox = function(req, res) {
	let userId = req.payload._id;
	Lunch.getLunchBox(moment(req.params.week), userId, (lunchs) => {
		res.send(lunchs);
	});
};

module.exports.create = function(req, res) {
	//hack without this it will force the _id to null
	delete req.body._id;

	let newLunch = new Lunch(req.body);

	if (!newLunch.image) {
		let numberHelper = require('../services/number-helper');
		newLunch.image = `image-lunch-default-${numberHelper.getRandomInt(1, 8)}.jpeg`;
	}
	let errors = [];

	if (newLunch.deliveryDate <= newLunch.limitDate) {
		errors.push('limit date should be lower  than delivery date');
	}

	if (newLunch.minParticipants > newLunch.maxParticipants) {
		errors.push('min participants count should be lower or equal than maximum participants count');
	}

	if (errors.length > 0) {
		res.send(500).json({msg: errors});
		return;
	}

	newLunch.deliveryDate = moment(newLunch.deliveryDate).startOf('day').toDate();
	newLunch.limitDate = moment(newLunch.limitDate).endOf('day').toDate();
	newLunch.save().then(lunch => {
		Lunch.populate(lunch, {path: "cook"}).then(lunch => {
			Lunch.populate(lunch, {path: "group"}).then(lunch => res.send(lunch))
		});
	});
};

module.exports.cancel = function(req, res) {
	let lunchId = req.body._id;

	Lunch.findById(lunchId).populate('participants').exec().then(lunch => {
		lunch.participants.forEach(participant => {
			Message.create({
				recipient: participant._id,
				title: `${participant.name}, The lunch ${lunch.title} was canceled by the cook`,
				type: 'message-lunch-canceled-by-cook',
				category: 'warning',
				data: {
					lunch: lunch
				}
			});
		});
		lunch.participants = [];
		lunch.status = 'canceled';
		lunch.save().then(lunch => {
			Lunch.populate(lunch, {path: "group"}).then(lunch => res.send(lunch));
		});
	});
};

module.exports.join = function(req, res) {
	let lunchId = req.params.id;
	let userId = req.payload._id;

	Lunch.findById(lunchId)
		.populate('cook')
		.populate('participants').exec()
		.then(lunch => {
			lunch.addParticipant(userId);
			lunch.save()
				.then(lunch => {
					User.findById(userId).exec()
						.then(user => {
							User.findById(lunch.cook).exec()
								.then((cook) => {
									Message.create({
										recipient: cook._id,
										title: `${user.name} has joined your lunch proposition ${lunch.title}`,
										type: 'message-lunch-join',
										category: 'success',
										data: {
											lunch: lunch,
											joinedBy: user,
										}
									});
									Lunch.populate(lunch, {path: "participants"}).then(lunch => res.send(lunch));
								});
						});
				});
		});
};

module.exports.leave = function(req, res) {
	let lunchId = req.params.id;
	let userId = req.payload._id;

	Lunch.findById(lunchId)
		.populate('cook')
		.exec().then(lunch => {
		lunch.removeParticipants(userId);
		lunch.save().then(lunch => {
			User.findById(userId).exec().then(user => {
				Message.create({
					recipient: lunch.cook._id,
					title: `${user.name} has left your lunch proposition ${lunch.title}`,
					type: 'message-lunch-left',
					category: 'warning',
					data: {
						lunch: lunch,
						joinedBy: user,
					}
				});
				Lunch.populate(lunch, {path: "participants"}).then(lunch => res.send(lunch));
			});
		});
	});
};
