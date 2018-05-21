let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (username, password, done) {
        User.findOne({email: username}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(new Error('User not found'));
            }

            if (!user.emailVerified) {
                return done(new Error('Account not activated'));
            }

            if (!user.validPassword(password)) {
                return done(new Error('Password is wrong'));
            }

            return done(null, user);
        });
    }
));