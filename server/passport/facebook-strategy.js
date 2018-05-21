let passport = require('passport');
let FacebookStrategy = require('passport-facebook-token');
let User = require('../models/user');
let clientID = process.env.FACEBOOK_CLIENT_ID || '1055819054566173';
let clientSecret = process.env.FACEBOOK_CLIENT_SECRET  || 'a730aee798715d24dad31aae106f7673';

passport.use(new FacebookStrategy({
		clientID: clientID,
		clientSecret: clientSecret
	},
	function(accessToken, refreshToken, profile, done) {
		User.upsertSocialUser(accessToken, refreshToken, profile, function(err, user) {
			return done(err, user);
		});
	})
);