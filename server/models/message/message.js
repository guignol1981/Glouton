let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
	destination: {type: Schema.Types.ObjectId, ref: 'User'},
	title: String,
	body: String,
	creationDate: String
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;