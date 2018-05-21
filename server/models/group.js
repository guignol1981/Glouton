let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let GeoData = require('./geo-data');

let groupSchema = new Schema({
	name: {type: String, required: true, unique: true},
	description: {type: String, required: true, unique: true},
	owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	members: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
	pending: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
	geoData: {type: Schema.Types.ObjectId, ref: 'GeoData', default: new GeoData()},
}, {usePushEach: true});

groupSchema.methods.addPending = function(userId, callback) {
	let exist = false;

	this.pending.forEach(pending => {
		if (pending == userId) {
			exist = true;
			return false;
		}
	});

	if (!exist) {
		this.pending.push(userId);
	}

	this.save().then(group => {
		callback(group, exist);
	});
};

groupSchema.methods.removePending = function(userId, callback) {
	let index = this.pending.indexOf(userId);
	if (index > -1) {
		this.pending.splice(index, 1);
	}

	this.save().then(group => {
		callback(group, index > -1);
	});
};

groupSchema.methods.addMember = function(userId, callback) {
	let exist = false;
	this.members.forEach(member => {
		if (member == userId) {
			exist = true;
			return false;
		}
	});

	if (!exist) {
		this.members.push(userId);
	}

	this.save().then(group => {
		callback(group, exist);
	});
};

groupSchema.methods.removeMember = function(userId, callback) {
	let index = this.members.indexOf(userId);
	if (index > -1) {
		this.members.splice(index, 1);
	}

	this.save().then(group => {
		callback(group, index > -1);
	});
};

groupSchema.statics.getOwned = function(userId, callback) {
	Group.find({owner: userId}).exec().then(groups => {
		callback(groups);
	});
};

groupSchema.statics.getJoined = function(userId, callback) {
	Group.find({members: {"$all": [userId]}}).exec().then(groups => {
		callback(groups);
	});
};

let Group = mongoose.model('Group', groupSchema);

module.exports = Group;