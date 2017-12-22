let Meal = require('../models/meal/meal');
let path = require('path');
let fs = require('fs');
let shortId = require('shortid');

module.exports.create = function (req, res) {
	let imgId = shortId.generate();

	fs.writeFile('server/files/' + imgId + '.png', req.file.buffer, 'binary', function (err) {
		if (err) {
			throw err;
		}

		res.status(200).json({msg: 'File saved', imageUrl: imgId + '.png'});
	});
};

module.exports.get = function (req, res) {
	Meal.findById(req.params.id, (err, meal) => {
		let imageUrl = meal.imageUrl;
		let img = fs.readFileSync('server/files/' + imageUrl);

		res.writeHead(200, {'Content-Type': 'image/gif'});
		res.end(img, 'binary');
	});
};