let Message = require('../models/message/message');

module.exports.getAll = function(req, res) {
	let userId = req.payload._id;

	Message.find({recipient: userId}, (err, messages) => {
		res.send(messages);
	});
};

module.exports.getUnseen = function(req, res) {
	let userId = req.payload._id;

	Message.find({recipient: userId, seen: false}, (err, messages) => {
		res.send(messages);
	});
};

module.exports.update = function(req, res) {
	let messageId = req.params.id;
	Message.findById(messageId, (err, message) => {
		message.seen = req.body.seen;
		message.save((err, message) => {
			res.send(message);
		});
	});
};