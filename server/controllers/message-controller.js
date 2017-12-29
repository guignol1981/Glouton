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
					author: message.author,
					recipient: message.recipient,
					data: message.data,
					thread: message.thread.reverse()
				}, (err, str) => {
					message.template = str;
				});
			});
			res.send(messages);
		});
};

module.exports.getUnseen = function (req, res) {
	let userId = req.payload._id;

	Message.find({recipient: userId, seen: false}).exec().then(messages => {
		res.send(messages);
	});
};

module.exports.update = function (req, res) {
	let messageId = req.params.id;
	Message.findById(messageId).exec().then(message => {
		message.seen = req.body.seen;
		message.save().then(message => {
			res.send(message);
		});
	});
};

module.exports.create = function (req, res) {
	delete req.body._id;
	let message = new Message(req.body);
	message.save().then(savedMessage => {
		Message.findById(savedMessage._id).populate('author').populate('recipient').exec().then(doc => res.send(doc));
	});
};

module.exports.delete = function (req, res) {
	Message.findById(req.params.id).remove().exec().then(res.send({msg: 'message removed'}));
};

