let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('./user');
let Group = require('./group');
let moment = require('moment');

let lunchSchema = new Schema({
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

lunchSchema.methods.userIsCook = function(userId) {
	return this.cook._id == userId;
};

lunchSchema.methods.addParticipant = function(userId) {
	if (this.limitDate < moment().toDate()) {
		throw 'its too late to join this lunch';
	}

	if (this.userIsCook(userId)) {
		throw 'This user is the cook and cannot join the lunch';
	}

	let exist = false;

	this.participants.forEach((participant) => {
		if (participant._id == userId) {
			exist = true;
		}
	});

	if (exist) {
		throw 'user already joined this lunch';
	}

	this.participants.push(userId);
};

lunchSchema.methods.removeParticipants = function(userId) {
	if (this.limitDate < moment().toDate()) {
		throw 'its too late to leave this lunch';
	}

	let index = this.participants.indexOf(userId);

	if (index > -1) {
		this.participants.splice(index, 1);
	} else {
		throw 'participant not found';
	}
};

lunchSchema.statics.getNewFailed = function(callback) {
	this.find({
		limitDate: {
			"$lt": moment().toDate()
		},
		status: 'pending'
	}).populate('cook').populate('participants').exec().then(lunchs => {
		let failed = [];
		lunchs.forEach(lunch => {
			if (lunch.participants.length < lunch.minParticipants) {
				failed.push(lunch);
			}
		});
		callback(failed);
	});
};

lunchSchema.statics.getList = function(groups, callback) {
	// let groupIds = [];
	// groups.forEach(group => {
	// 	groupIds.push(group._id);
	// });

	Lunch.find({})
		.where('group').in(groups)
		.where('status').in(['pending', 'confirmed'])
		.where('deliveryDate').gte(moment().startOf('day').toDate())
		.populate('cook')
		.populate('group')
		.populate('participants')
		.exec().then(lunchs => callback(lunchs));
};

lunchSchema.statics.getLunchBox = function(weekFirstDay, userId, callback) {
	let weekLastDay = moment(weekFirstDay);
	weekLastDay.endOf('week');
	Lunch.find({
		deliveryDate: {
			"$gt": weekFirstDay.subtract(1, 'day').toDate(),
			"$lt": weekLastDay.add(1, 'day').toDate(),
		}
	})
		.where('status').in(['pending', 'confirmed'])
		.populate('cook')
		.populate('participants')
		.populate('group')
		.exec().then(lunchs => {
		callback(lunchs);
	});
};

lunchSchema.statics.getNewConfirmed = function(callback) {
	this.find({
		limitDate: {
			"$lt": moment().toDate()
		},
		status: 'pending'
	}).populate('cook').populate('participants').exec().then(lunchs => {
		let confirmed = [];
		lunchs.forEach(lunch => {
			if (lunch.participants.length >= lunch.minParticipants) {
				confirmed.push(lunch);
			}
		});
		callback(confirmed);
	});
};

let Lunch = mongoose.model('Lunch', lunchSchema);

module.exports = Lunch;