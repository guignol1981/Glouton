let express = require('express');
let router = express.Router();
let jwt = require('express-jwt');
let auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
});
let ctrlProfile = require('../controllers/profile');
let ctrlAuth = require('../controllers/authentications');
let Meal = require('../models/meal/meal');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/meals/:id', (req, res) => {
	let id = req.params.id;

	Meal.findById(id, (err, meal) => {
		if (err) {
			throw err;
		}

		res.send(meal);
	});
});

router.get('/meals', (req, res) => {
	Meal.find({}, (err, meals) => {
		if (err) {
			throw err;
		}
		res.send(meals);
	});
});

router.post('/meals', (req, res) => {
	let meal = new Meal({
		title: req.body.title,
		description: req.body.description,
		date: req.body.date,
		cook: req.body.cook
	});

	meal.save((err, meal) => {
		if (err) {
			throw err;
		}
		res.send(meal);
	});
});

module.exports = router;