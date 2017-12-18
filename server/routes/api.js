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

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//meals
router.get('/meals/:id', ctrlMeal.get);
router.get('/meals', ctrlMeal.getAll);
router.post('/meals', ctrlMeal.create);
router.put('/meals/join/:id', ctrlMeal.join);

module.exports = router;