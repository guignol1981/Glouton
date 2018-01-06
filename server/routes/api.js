let express = require('express');
let router = express.Router();
let jwt = require('express-jwt');
let auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
});
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});

let ctrlProfile = require('../controllers/profile');
let ctrlAuth = require('../controllers/authentications');
let ctrlMeal = require('../controllers/meal-controller');
let ctrlMealImage = require('../controllers/meal-image-controller');
let ctrlMessage = require('../controllers/message-controller');
let ctrlVersion = require('../controllers/version-controller');

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

module.exports = router;