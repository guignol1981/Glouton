let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now()
	},
	hash: String,
	salt: String
});

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),
		creationDate: {type: Date, default: Date.now()}
	}, "MY_SECRET");
};

let User = mongoose.model('User', userSchema);
module.exports.schema = userSchema;
module.exports = User;