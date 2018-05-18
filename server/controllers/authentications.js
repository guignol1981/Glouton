let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Message = require('../models/message/message');
let jwt = require('jsonwebtoken');

let sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function (req, res) {
	if (!req.body['name'] || !req.body['email'] || !req.body['password']) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}

	let user = new User();

	user.name = req.body['name'];
	user.email = req.body['email'];
	user.setPassword(req.body['password']);

	user.save(function (err) {
		if (err) {
			if (err.code === 11000) {
				res.status(500).json({msg: 'this email is already used'});
			}
			return;
		}

		let token;
		token = user.generateJwt();

		Message.create({
			recipient: user._id,
			title: `Welcome ${user.name}!`,
			type: 'message-register',
			category: 'primary'
		});
		res.status(200).json({
			"token": token
		});
	});

};

module.exports.login = function (req, res) {
	if (!req.body['email'] || !req.body['password']) {
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

let createToken = function (auth) {
	return jwt.sign({
			id: auth.id
		}, 'my-secret',
		{
			expiresIn: 60 * 120
		});
};

module.exports.generateToken = function (req, res, next) {
	req.token = createToken(req.auth);
	next();
};

module.exports.sendToken = function (req, res) {
	res.setHeader('x-auth-token', req.token);
	res.status(200).send(req.auth);
};

module.exports.prepareReqForToken = function (req, res, next) {
	if (!req.user) {
		return res.send(401, 'User Not Authenticated');
	}

	req.auth = {
		id: req.user.id
	};

	next();
};
