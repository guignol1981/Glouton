let express = require('express');
let router = express.Router();
let jwt = require('express-jwt');
let auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
});

let ctrlProfile = require('../controllers/profile');
let ctrlAuth = require('../controllers/authentications');
let ctrlMeal = require('../controllers/meal-controller');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/profile', auth, ctrlProfile.profileRead);

//meals
router.get('/meals/joined', auth, ctrlMeal.getJoined);
router.get('/meals/:id', auth, ctrlMeal.get);
router.get('/meals', auth, ctrlMeal.getAll);
router.post('/meals', auth, ctrlMeal.create);
router.put('/meals/join/:id', auth, ctrlMeal.join);

module.exports = router;