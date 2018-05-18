let GStorage = require('@google-cloud/storage');
let storage = new GStorage();
let bucketName = process.env.NODE_ENV === 'prod' ? 'lunch-box-image' : 'lunch-box-image-dev';
const bucket = storage.bucket(bucketName);

let getPublicUrl = function (filename) {
	return `https://storage.googleapis.com/${bucketName}/${filename}`;
};

module.exports.sendUploadToGCS = function (req, res, next) {
	if (!req.file) {
		return next();
	}

	const gcsname = Date.now() + req.file.originalname;
	const file = bucket.file(gcsname);

	const stream = file.createWriteStream({
		metadata: {
			contentType: req.file.mimetype
		}
	});

	stream.on('error', (err) => {
		req.file.cloudStorageError = err;
		next(err);
	});

	stream.on('finish', () => {
		req.file.cloudStorageObject = gcsname;
		file.makePublic().then(() => {
			req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
			next();
		});
	});

	stream.end(req.file.buffer);
};

module.exports.upload = function (req, res, next) {
	let data = req.body;

	if (req.file && req.file.cloudStoragePublicUrl) {
		data.cloudStoragePublicUrl = req.file.cloudStoragePublicUrl;
		data.cloudStorageObject = req.file.cloudStorageObject;
	}

	res.send({
		msg: 'Image uploaded',
		data: data
	});
};

module.exports.remove = function (req, res) {
	let cloudstorageobject = req.params.cloudstorageobject;
	let file = bucket.file(cloudstorageobject);
	file.delete((err, apiResponse) => {
		if (!err) {
			res.send({
				msg: 'Image removed',
				data: true
			});
		} else {
			res.status(500).send({
				msg: err,
				data: false
			});
		}
	});
};



