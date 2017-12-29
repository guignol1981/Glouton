let Message = require('../models/message/message');

module.exports.getAll = function (req, res) {
	let userId = req.payload._id;

	Message.find({recipient: userId})
		.populate('author')
		.populate('recipient')
		.exec()
		.then((messages) => {
			messages.forEach(message => {
				res.render(message.type, {
					recipient: message.recipient,
					data: message.data
				}, (err, str) => {
					message.template = str;
				});
			});
			res.send(messages);
		});
};

module.exports.getUnseen = function (req, res) {
	let userId = req.payload._id;

	Message.find({recipient: userId, seen: false}, (err, messages) => {
		res.send(messages);
	});
};

module.exports.update = function (req, res) {
	let messageId = req.params.id;
	Message.findById(messageId, (err, message) => {
		message.seen = req.body.seen;
		message.save((err, message) => {
			res.send(message);
		});
	});
};

module.exports.create = function (req, res) {
	delete req.body._id;
	let message = new Message(req.body);
	message.save((err, savedMessage) => {
		res.send(savedMessage);
	});
};

module.exports.delete = function (req, res) {
	let messageId = req.params.id;

	Message.findById(messageId).remove().exec().then(res.send({msg: 'message removed'}));
};

