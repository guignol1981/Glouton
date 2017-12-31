let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../user/user');
let moment = require('moment');

let mealSchema = new Schema({
	title: String,
	description: String,
	image: String,
	deliveryDate: Date,
	limitDate: Date,
	cook: {type: Schema.Types.ObjectId, ref: 'User'},
	minParticipants: Number,
	maxParticipants: Number,
	participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
	creationDate: {type: Date, default: Date.now()},
	status: {type: String, default: 'pending'}
}, {usePushEach: true});

mealSchema.methods.userIsCook = function (userId) {
	return this.cook._id == userId;
};

mealSchema.methods.addParticipant = function (userId) {
	if (this.limitDate < new Date()) {
		throw 'its too late to join this meal';
	}

	if (this.userIsCook(userId)) {
		throw 'This user is the cook and cannot join the meal';
	}

	let exist = false;

	this.participants.forEach((participant) => {
		if (participant._id == userId) {
			exist = true;
		}
	});

	if (exist) {
		throw 'user already joined this meal';
	}

	this.participants.push(userId);
};

mealSchema.methods.removeParticipants = function (userId) {
	if (this.limitDate < new Date()) {
		throw 'its too late to leave this meal';
	}

	let index = this.participants.indexOf(userId);

	if (index > -1) {
		this.participants.splice(index, 1);
	} else {
		throw 'participant not found';
	}
};

mealSchema.statics.getNewFailed = function (callback) {
	this.find({
		limitDate: {
			"$lt": moment().startOf('day').subtract(1, 'second').toDate()
		},
		status: 'pending'
	}).populate('cook').populate('participants').exec().then(meals => {
		let failed = [];
		meals.forEach(meal => {
			if (meal.participants.length < meal.minParticipants) {
				failed.push(meal);
			}
		});
		callback(failed);
	});
};

mealSchema.statics.getList = function(callback) {
	Meal.find({
			deliveryDate: {
				"$gt": new Date()
			}
		})
		.where('status').in(['pending', 'confirmed'])
		.populate('cook')
		.populate('participants')
		.exec().then(meals => callback(meals));
};

mealSchema.statics.getLunchBox = function (userId, callback) {
	Meal.find({
			deliveryDate: {
				"$gt": new Date()
			}
		})
		.where('status').in(['pending', 'confirmed'])
		.populate('cook')
		.populate('participants')
		.exec().then(meals => {
			let lunchBox = [];

			meals.forEach((meal) => {
				meal.participants.forEach((participant) => {
					if (participant.id == userId) {
						lunchBox.push(meal);
					}
				});
			});

			callback(lunchBox);
		});
};

mealSchema.statics.getNewConfirmed = function (callback) {
	this.find({
		limitDate: {
			"$lt": moment().startOf('day').subtract(1, 'second').toDate()
		},
		status: 'pending'
	}).populate('cook').populate('participants').exec().then(meals => {
		let confirmed = [];
		meals.forEach(meal => {
			if (meal.participants.length >= meal.minParticipants) {
				confirmed.push(meal);
			}
		});
		callback(confirmed);
	});
};

let Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;