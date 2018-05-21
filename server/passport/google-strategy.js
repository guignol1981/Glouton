let passport = require('passport');
let GoogleTokenStrategy = require('passport-google-token').Strategy;
let User = require('../models/user');
let clientID = process.env.GOOGLE_CLIENT_ID || '591045054488-e7upjbeo2710idm0a00hhdbusmghfulh.apps.googleusercontent.com\n';
let clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'eZDYKD12tJFXWv_ZBt_2tM2K';

passport.use(new GoogleTokenStrategy({
        clientID: clientID,
        clientSecret: clientSecret
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertSocialUser(accessToken, refreshToken, profile, function (err, user) {
            return done(err, user);
        });
    }
));