let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user/user');

passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function (username, password, done) {
		User.findOne({email: username}, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					message: 'User not found'
				});
			}

			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Password is wrong'
				});
			}

			return done(null, user);
		});
	}
));