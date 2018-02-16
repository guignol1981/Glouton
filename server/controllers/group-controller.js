let Group = require('../models/group/group');

module.exports.create = function(req, res) {
	let group = new Group(req.body);
	group.save().then(group => {
		res.send({
			data: group,
			msg: 'Group created!'
		});
	})
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