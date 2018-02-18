let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let GeoData = require('../geo-data/geo-data');

let groupSchema = new Schema({
	name: {type: String, required: true, unique: true},
	description: {type: String, required: true, unique: true},
	owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	members: [{type: Schema.Types.ObjectId, ref: 'User'}],
	geoData: {type: Schema.Types.ObjectId, ref: 'GeoData', default: new GeoData()}
});

let Group = mongoose.model('Group', groupSchema);

module.exports = Group;