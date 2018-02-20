let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../user/user');
let Group = require('../group/group');
let moment = require('moment');

let mealSchema = new Schema({
	group: {type: Schema.Types.ObjectId, ref: 'Group', require: true},
	title: String,
	description: String,
	image: String,
	deliveryDate: Date,
	deliveryHour: {type: Number, default: 11},
	limitDate: Date,
	cook: {type: Schema.Types.ObjectId, ref: 'User'},
	minParticipants: Number,
	maxParticipants: Number,
	participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
	creationDate: {type: Date, default: Date.now()},
	contribution: {type: Number, default: 0},
	status: {type: String, default: 'pending'},
	type: {type: Number, default: 1},
}, {usePushEach: true});

mealSchema.methods.userIsCook = function(userId) {
	return this.cook._id == userId;
};

mealSchema.methods.addParticipant = function(userId) {
	if (this.limitDate < moment().toDate()) {
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

mealSchema.methods.removeParticipants = function(userId) {
	if (this.limitDate < moment().toDate()) {
		throw 'its too late to leave this meal';
	}

	let index = this.participants.indexOf(userId);

	if (index > -1) {
		this.participants.splice(index, 1);
	} else {
		throw 'participant not found';
	}
};

mealSchema.statics.getNewFailed = function(callback) {
	this.find({
		limitDate: {
			"$lt": moment().toDate()
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

mealSchema.statics.getList = function(groups, callback) {
	Meal.find({})
		.where('group').in(groups)
		.where('status').in(['pending', 'confirmed'])
		.where('deliveryDate').gte(moment().startOf('day').toDate())
		.populate('cook')
		.populate('group')
		.populate('participants')
		.exec().then(meals => callback(meals));
};

mealSchema.statics.getLunchBox = function(weekFirstDay, userId, callback) {
	let weekLastDay = moment(weekFirstDay);
	weekLastDay.endOf('week');
	Meal.find({
		deliveryDate: {
			"$gt": weekFirstDay.subtract(1, 'day').toDate(),
			"$lt": weekLastDay.add(1, 'day').toDate(),
		}
	})
		.where('status').in(['pending', 'confirmed'])
		.populate('cook')
		.populate('participants')
		.populate('group')
		.exec().then(meals => {
		console.log(meals);
		callback(meals);
	});
};

mealSchema.statics.getNewConfirmed = function(callback) {
	this.find({
		limitDate: {
			"$lt": moment().toDate()
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