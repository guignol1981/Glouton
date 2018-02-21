let Group = require('../models/group/group');
let GeoData = require('../models/geo-data/geo-data');
let Message = require('../models/message/message');
let User = require('../models/user/user');

module.exports.create = function(req, res) {
	let userId = req.payload['_id'];
	let group = new Group(req.body);
	let geoData = new GeoData(req.body['geoData']);

	geoData.save();
	group.name = group.name.toLowerCase();
	group.owner = userId;
	group.geoData = geoData;

	group.save().then(group => {
		res.send({
			data: group,
			msg: 'Group created!'
		});
	})
};

module.exports.checkAvailability = function(req, res) {
	Group.find({name: req.params.name.toLowerCase()})
		.exec().then(groups => {
		if (groups.length > 0) {
			res.send({
				data: false,
				msg: 'Group name already in use'
			})
		} else {
			res.send({
				data: true,
				msg: 'Group name available'
			})
		}
	});
};

module.exports.getByName = function(req, res) {
	let name = req.params.name;

	Group.find({name: {$regex: '.*' + name + '.*'}})
		.populate('members')
		.populate('owner')
		.populate('pending')
		.exec().then(groups => {
		res.send({
			data: groups,
			msg: 'Groups found!'
		});
	});
};

module.exports.getList = function(req, res) {
	Group.find({})
		.populate('geoData')
		.exec().then(groups => {
		res.send({
			data: groups,
			msg: 'Groups found!'
		});
	});
};

module.exports.joined = function(req, res) {
	let userId = req.payload._id;
	let groups = [];

	Group.getOwned(userId, (ownedGroups) => {
		groups = ownedGroups;
		Group.getJoined(userId, (joinedGroup) => {
			groups.concat(joinedGroup);
			res.send({
				data: groups,
				msg: 'Groups found'
			});
		});
	});
};

module.exports.joinRequest = function(req, res) {
	let userId = req.payload._id;
	let groupId = req.params.id;

	User.findById(userId).exec().then(user => {
		Group.findById(groupId)
			.populate('owner')
			.populate('members')
			.populate('pending')
			.exec().then(group => {
			group.addPending(userId, (group, exist) => {
				Message.create({
					recipient: group.owner,
					title: `${user.name} want to join ${group.name}`,
					type: 'group-join-request',
					category: 'info',
					data: {
						user: user,
						group: group
					}
				});

				res.status(exist ? 202 : 200).send({
					data: group,
					msg: exist ? 'Request already sent' : 'Request sent'
				});
			});
		});
	});
};

module.exports.cancelJoinRequest = function(req, res) {
	let userId = req.payload._id;
	let groupId = req.params.id;

	Group.findById(groupId).exec().then(group => {
		group.removePending(userId, (group, exist) => {
			res.status(exist ? 200 : 202).send({
				data: group,
				msg: exist ? 'User removed from pending' : 'User not in pending'
			});
		});
	});
};

module.exports.confirmJoinRequest = function(req, res) {
	let groupId = req.params['groupid'];
	let userId = req.params['userid'];
	let accept = req.params['accept'];

	Group.findById(groupId).exec().then(group => {
		group.removePending(userId, (group, exist) => {
			group.addMember(userId, (group, exist) => {
				res.status(exist ? 202 : 200).send({
					data: group,
					msg: exist ? 'User already joined group' : 'User joined group'
				});
			});
		});
	});
};

module.exports.leave = function(req, res) {
	let userId = req.payload._id;
	let groupId = req.params.id;

	Group.findById(groupId).exec().then(group => {
		group.removeMember(userId, (group, exist) => {
			res.send({
				data: group,
				msg: 'User left group'
			});
		});
	});
};

module.exports.remove = function(req, res) {
	let groupId = req.params.id;

	Group.findById(groupId).exec().then(group => {
		group.remove();
		res.send({
			data: null,
			msg: 'Group removed'
		})
	});
};
