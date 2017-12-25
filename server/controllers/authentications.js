let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Message = require('../models/message/message');

let sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function (req, res) {
	if (!req.body.name || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}

	let user = new User();

	user.name = req.body.name;
	user.email = req.body.email;
	user.setPassword(req.body.password);

	user.save(function (err) {
		if (err) {
			res.status(500).json(err);
			return;
		}

		let token;
		token = user.generateJwt();
		Message.create({
			recipient: user._id,
			title: `Welcome ${user.name}!`,
			body: `${user.name}! now is the begin of a new era for you. Why? Because your kitchen just expanded the size of your organization. Start today suggesting meal or join other's proposition!! If you have any suggestion or question, be sure to adress to us your concern. Have a very nice day!`,
			creationDate: Date.now(),
			type: 'success'
		});
		res.status(200).json({
			"token": token
		});
	});

};

module.exports.login = function (req, res) {
	if (!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}

	passport.authenticate('local', function (err, user, info) {
		let token;

		if (err) {
			res.status(404).json(err);
			return;
		}

		if (user) {
			token = user.generateJwt();
			res.status(200);
			res.json({
				"token": token
			});
		} else {
			res.status(401).json(info);
		}
	})(req, res);

};