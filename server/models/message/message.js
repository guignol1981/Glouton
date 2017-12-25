let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
	recipient: {type: Schema.Types.ObjectId, ref: 'User'},
	title: String,
	body: String,
	creationDate: Date,
	type: String,
	seen: {type: Boolean, default: false}
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;