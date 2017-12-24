let Message = require('../models/message/message');

module.exports.getAll = function(req, res) {
	let userId = req.payload._id;

	Message.find({destination: userId}, (err, messages) => {
		res.send(messages);
	});
};