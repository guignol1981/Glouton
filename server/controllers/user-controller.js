let mongoose = require('mongoose');
let User = mongoose.model('User');
let Message = require('../models/message');

module.exports.register = function(req, res) {
	if (!req.body['name'] || !req.body['email'] || !req.body['password']) {
		res.status(400).send({
			msg: 'All fields required',
			data: false
		});
		return;
	}

	let user = new User();

	user.name = req.body['name'];
	user.email = req.body['email'];
	user.setPassword(req.body['password']);

	user.save(function(err) {
		if (err) {
			if (err.code === 11000) {
				res.status(500).json({
					msg: 'This email is already used',
					data: false
				});
			}
			return;
		}

		res.status(200).json({
			msg: 'Account created',
			data: user
		});
	});
};
