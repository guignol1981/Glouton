let Meal = require('../models/meal/meal');
let fs = require('fs');

module.exports.create = function (req, res) {
	try {
		function decodeBase64Image(dataString) {
			let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
			let response = {};

			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}

			response.type = matches[1];
			response.data = new Buffer(matches[2], 'base64');

			return response;
		}

		let imageTypeRegularExpression = /\/(.*?)$/;
		let crypto = require('crypto');
		var seed = crypto.randomBytes(20);
		let uniqueSHA1String = crypto
			.createHash('sha1')
			.update(seed)
			.digest('hex');

		let base64Data = req.body.image;

		let imageBuffer = decodeBase64Image(base64Data);
		let userUploadedFeedMessagesLocation = 'server/files/';

		let uniqueRandomImageName = 'image-' + uniqueSHA1String;
		let imageTypeDetected = imageBuffer
			.type
			.match(imageTypeRegularExpression);

		let userUploadedImagePath = userUploadedFeedMessagesLocation +
			uniqueRandomImageName +
			'.' +
			imageTypeDetected[1];

		try {
			require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
				function () {
					console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
					res.status(200).json({
						msg: 'File saved', image: uniqueRandomImageName +
						'.' +
						imageTypeDetected[1]
					});
				});
		}
		catch (error) {
			console.log('ERROR:', error);
		}

	}
	catch (error) {
		console.log('ERROR:', error);
	}
};

module.exports.get = function (req, res) {
	Meal.findById(req.params.id, (err, meal) => {
		let img = fs.readFileSync('server/files/' + meal.image);

		res.writeHead(200, {'Content-Type': 'image/gif'});
		res.end(img, 'binary');
	});
};