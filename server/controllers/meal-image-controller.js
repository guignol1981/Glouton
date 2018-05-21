let Lunch = require('../models/lunch');
let fs = require('fs');
let Storage = require('@google-cloud/storage');
let storage = new Storage();
let bucketName = process.env.NODE_ENV === 'prod' ? 'lunch-box' : 'lunch-box-dev';

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
        let seed = crypto.randomBytes(20);
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
            fs.writeFile(userUploadedImagePath, imageBuffer.data,
                function () {
                    storage
                        .bucket(bucketName)
                        .upload(userUploadedImagePath)
                        .then(() => {
                            fs.unlinkSync(userUploadedImagePath);
                            res.status(200).json({
                                msg: 'File saved', image: uniqueRandomImageName +
                                '.' +
                                imageTypeDetected[1]
                            });
                        })
                        .catch(err => {
                            console.error('ERROR:', err);
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
    Lunch.findById(req.params.id, (err, lunch) => {
        let srcFilename = lunch.image;
        let destFilename = 'server/files/' + lunch.image;
        let options = {
            destination: destFilename
        };

        fs.readFile(destFilename, (err, img) => {
            if (err) {
                storage
                    .bucket(bucketName)
                    .file(srcFilename)
                    .download(options)
                    .then(() => {
                        let img = fs.readFileSync(destFilename);
                        fs.unlinkSync(destFilename);
                        res.writeHead(200, {'Content-Type': 'image/gif'});
                        res.end(img, 'binary');
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
            } else {
                res.writeHead(200, {'Content-Type': 'image/gif'});
                res.end(img, 'binary');
            }
        });


    });
};