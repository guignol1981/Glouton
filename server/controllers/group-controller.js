let Group = require('../models/group/group');
let GeoData = require('../models/geo-data/geo-data');

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

	Group.find({name: {$regex: '.*' + name + '.*'}}).exec().then(groups => {
		res.send({
			data: groups,
			msg: 'Groups found!'
		});
	});
};

module.exports.getList = function(req, res) {
	let name = req.params.name;

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

module.exports.join = function(req, res) {

};

module.exports.leave = function(req, res) {

};

module.exports.remove = function(req, res) {

};
