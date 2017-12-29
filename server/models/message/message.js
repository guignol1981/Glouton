let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	recipient: {type: Schema.Types.ObjectId, ref: 'User'},
	title: String,
	creationDate: {type: Date, default: Date.now()},
	seen: {type: Boolean, default: false},
	type: String,
	category: {type: String, default: 'secondary'},
	template: String,
	data: Schema.Types.Mixed
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;