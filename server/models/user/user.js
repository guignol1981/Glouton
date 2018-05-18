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
	photoData: {
		type: Schema.Types.Mixed,
		required: true,
		default: null
	},
	provider: {
		type: {
			id: String,
			token: String,
			source: String
		},
		select: false
	},
	creationDate: {
		type: Date,
		default: Date.now()
	},
	hash: String,
	salt: String,
	emailVerified: {type: Boolean, default: false}
});

userSchema.statics.upsertSocialUser = function(accessToken, refreshToken, profile, callback) {
	let that = this;

	return this.findOne({
		'provider.id': profile.id
	}, function(err, user) {
		if (!user) {
			let newUser = new that({
				name: profile.name.givenName,
				email: profile.emails[0].value,
				photoData: {
					cloudStorageObject: null,
					cloudStoragePublicUrl: profile.photos ? profile.photos[0].value : profile._json.picture
				},
				provider: {
					id: profile.id,
					token: accessToken,
					source: profile.provider
				},
			});

			newUser.save(function(err, savedUser) {
				return callback(err, savedUser);
			});
		} else {
			return callback(err, user);
		}
	});
};

userSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
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