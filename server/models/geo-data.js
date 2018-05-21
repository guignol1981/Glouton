let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let geoDataSchema = new Schema({
	lat: {type: String},
	lng: {type: String},
	formattedAddress: {type: String}
});

let GeoData = mongoose.model('GeoData', geoDataSchema);

module.exports = GeoData;