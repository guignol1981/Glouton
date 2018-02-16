let Group = require('../models/group/group');

module.exports.getByName = function(req, res) {
	let name = req.params.name;

	Group.find({name: {$regex: '.*' + name + '.*'}}).exec().then(groups => {
		console.log(groups);
	});

	res.send({});
};