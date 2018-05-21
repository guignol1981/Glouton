let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let versionSchema = new Schema({
    versionNumber: String,
    features: [String],
    fixes: [String],
    knownIssues: [String],
    creationDate: {type: Date, default: Date.now()}
});

let Version = mongoose.model('Version', versionSchema);

module.exports = Version;