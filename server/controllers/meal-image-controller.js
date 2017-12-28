let Meal = require('../models/meal/meal');
let fs = require('fs');
let shortId = require('shortid');

module.exports.create = function (req, res) {
	let imgId = shortId.generate();
	let pngIndex = req.body.image.indexOf('png');
	let base64Data = null;
	let ext = null;
	if (pngIndex > -1) {
		ext = '.png';
		base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
	} else {
		ext = '.jpg';
		base64Data = req.body.image.replace(/^data:image\/jpg;base64,/, "");
	}

	fs.writeFile('server/files/' + imgId + ext, base64Data, 'base64', function (err) {
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