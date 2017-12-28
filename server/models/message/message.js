let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
	recipient: {type: Schema.Types.ObjectId, ref: 'User'},
	title: String,
	body: [String],
	creationDate: {type: Date, default: Date.now()},
	type: String,
	seen: {type: Boolean, default: false},
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	template: String
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;