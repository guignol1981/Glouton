let Version = require('../models/version/version');

module.exports.getList = function(req, res) {
    Version.find({}).exec().then(versions => res.send(versions.reverse()));
};
