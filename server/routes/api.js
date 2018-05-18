let express = require('express');
let router = express.Router();
let auth = require('express-jwt')({secret: 'my-secret', requestProperty: 'auth'});
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});
let passport = require('passport');

let ctrlProfile = require('../controllers/profile');
let ctrlAuth = require('../controllers/authentications');
let ctrlMeal = require('../controllers/meal-controller');
let ctrlMealImage = require('../controllers/meal-image-controller');
let ctrlMessage = require('../controllers/message-controller');
let ctrlVersion = require('../controllers/version-controller');
let ctrlGroup = require('../controllers/group-controller');
let ctrlGoogleMap = require('../controllers/google-map-controller');

//auth
router.post('/auth/facebook',
	(req, res, next) => {
		passport.authenticate('facebook-token', (err, user) => {
			if (err && err.code === 11000) {
				let msg = 'Something went wrong';

				if (err.code === 11000) {
					msg = 'This email is already used'
				}
				res.status(500).json({msg: msg});
				return;
			}

			req.user = user;
			next();
		})(req, res, next);
	},
	ctrlAuth.prepareReqForToken,
	ctrlAuth.generateToken,
	ctrlAuth.sendToken);

router.post('/auth/google',
	(req, res, next) => {
		passport.authenticate('google-token', (err, user) => {
			if (err && err.code === 11000) {
				let msg = 'Something went wrong';

				if (err.code === 11000) {
					msg = 'This email is already used'
				}
				res.status(500).json({msg: msg});
				return;
			}

			req.user = user;
			next();
		})(req, res, next);
	},
	ctrlAuth.prepareReqForToken,
	ctrlAuth.generateToken,
	ctrlAuth.sendToken);

router.post('/auth/local',
	(req, res, next) => {
		passport.authenticate('local', (err, user) => {
			if (err) {
				res.status(500).json({
					msg: err.message,
					data: false
				});
				return;
			}

			req.user = user;
			next();
		})(req, res, next);
	},
	ctrlAuth.prepareReqForToken,
	ctrlAuth.generateToken,
	ctrlAuth.sendToken);

//user
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/profile', auth, ctrlProfile.profileRead);

//meal
router.get('/meals/lunch-box/:week', auth, ctrlMeal.getLunchBox);
router.get('/meals/:id', auth, ctrlMeal.get);
router.put('/meals/:id', auth, ctrlMeal.update);
router.put('/meals/join/:id', auth, ctrlMeal.join);
router.put('/meals/leave/:id', auth, ctrlMeal.leave);
router.put('/meals', auth, ctrlMeal.cancel);
router.get('/meals', auth, ctrlMeal.getAll);
router.post('/meals', auth, ctrlMeal.create);

//images
router.get('/images/meal/:id', ctrlMealImage.get);
router.post('/images/meal', auth, upload.single('image'), ctrlMealImage.create);

//messages
router.put('/messages/:id', auth, ctrlMessage.update);
router.delete('/messages/:id', auth, ctrlMessage.delete);
router.post('/messages', auth, ctrlMessage.create);
router.get('/messages', auth, ctrlMessage.getAll);
router.get('/messages/unseen', auth, ctrlMessage.getUnseen);

//version
router.get('/versions', auth, ctrlVersion.getList);

//group
router.get('/groups/joined', auth, ctrlGroup.joined);
router.put('/groups/join-request/:id', auth, ctrlGroup.joinRequest);
router.put('/groups/cancel-join-request/:id', auth, ctrlGroup.cancelJoinRequest);
router.get('/groups/confirm-join-request/:groupid/:userid/:accept', auth, ctrlGroup.confirmJoinRequest);
router.put('/groups/leave/:id', auth, ctrlGroup.leave);
router.delete('/groups/remove/:id', auth, ctrlGroup.remove);
router.get('/groups/availability/:name', ctrlGroup.checkAvailability);
router.get('/groups/:name', ctrlGroup.getByName);
router.get('/groups', ctrlGroup.getList);
router.post('/groups', auth, ctrlGroup.create);

//map
router.get('/google-map/:address', ctrlGoogleMap.getGeoData);

module.exports = router;