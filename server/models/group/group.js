let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupSchema = new Schema({
	name: {type: String, required: true, unique: true},
	members: [{type: Schema.Types.ObjectId, ref: 'User'}],
	authorizedEmails: [{type: String, default: []}]
});

let Group = mongoose.model('Group', groupSchema);

module.exports = Group;