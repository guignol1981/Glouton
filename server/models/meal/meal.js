let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../user/user');

let mealSchema = new Schema({
	title: String,
	description: String,
	imageUrl: String,
	date: Date,
	limitDate: Date,
	limitDateToJoin: Date,
	cook: {type: Schema.Types.ObjectId, ref: 'User'},
	minParticipants: Number,
	maxParticipants: Number,
	participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
	creationDate: {type: Date, default: Date.now()},
	status: {type: String, default: 'pending'},
	canceled: {type: Boolean, default: false}
}, {usePushEach: true});

mealSchema.methods.userIsCook = function (userId) {
	return this.cook._id == userId;
};

mealSchema.methods.addParticipant = function (userId) {
	if (this.limitDate < Date.now()) {
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
	if (this.limitDate < Date.now()) {
		throw 'its too late to leave this meal';
	}

	let index = this.participants.indexOf(userId);

	if (index > -1) {
		this.participants.splice(index, 1);
	} else {
		throw 'participant not found';
	}
};

mealSchema.statics.getLimitDateReached = function (callback) {
	let yesterday = new Date();
	yesterday = yesterday.setDate(yesterday.getDate() - 1);
	let tomorrow = new Date();
	tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);

	this.find({
		"limitDate": {
			"$gte": yesterday,
			"$lt": tomorrow
		}
	}).populate('cook').populate('participants').exec((err, meals) => callback(meals));
};

let Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;