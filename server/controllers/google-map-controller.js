var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDgQC2X_l3E6ol88MSuBGaAuZm-FjXRNXs'
});
let GeoData = require('../models/geo-data/geo-data');


module.exports.getGeoData = function(req, res) {
	let address = req.params.address;

	if (address.length < 3) {
		res.send({
			data: '',
			msg: 'address too short'
		});
		return;
	}

	googleMapsClient.geocode({
		address: address
	}, function(err, response) {
		if (!err) {
			let data = response.json.results[0];

			if (data) {
				geoData = new GeoData();
				geoData.lat = data['geometry']['location']['lat'];
				geoData.lng = data['geometry']['location']['lng'];
				geoData.formattedAddress = data['formatted_address'];
				res.send({
					data: geoData,
					msg: 'Address valid'
				});
			} else  {
				res.send({
					data: {},
					msg: 'Address invalid'
				})
			}

		}
	});
};