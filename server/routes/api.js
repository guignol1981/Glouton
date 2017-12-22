let express = require('express');
let router = express.Router();
let jwt = require('express-jwt');
let auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
});
let multer = require('multer');
let upload  = multer({ storage: multer.memoryStorage() });

let ctrlProfile = require('../controllers/profile');
let ctrlAuth = require('../controllers/authentications');
let ctrlMeal = require('../controllers/meal-controller');
let ctrlMealImage = require('../controllers/meal-image-controller');

//user
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/profile', auth, ctrlProfile.profileRead);

//meal
router.get('/meals/joined', auth, ctrlMeal.getJoined);
router.get('/meals/:id', auth, ctrlMeal.get);
router.put('/meals/:id', auth, ctrlMeal.update);
router.get('/meals', auth, ctrlMeal.getAll);
router.post('/meals', auth, ctrlMeal.create);
router.put('/meals/join/:id', auth, ctrlMeal.join);

//images
router.get('/images/meal/:id', ctrlMealImage.get);
router.post('/images/meal', auth, upload.single('image'), ctrlMealImage.create);

module.exports = router;