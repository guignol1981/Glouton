let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Message = require('../models/message');
let jwt = require('jsonwebtoken');

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
