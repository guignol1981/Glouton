let Meal = require('../models/meal/meal');
let User = require('../models/user/user');
let Message = require('../models/message/message');
let moment = require('moment');
let dateHelper = require('../services/date-helper');

module.exports.get = function (req, res) {
    let id = req.params.id;

    Meal.findById(id).populate('cook').populate('participants').exec()
        .then(meal => {
            res.send(meal)
        });
};

module.exports.getAll = function (req, res) {
    Meal.getList(meals => {
        res.send(meals)
    });
};

module.exports.update = function (req, res) {
    let mealId = req.params.id;

    Meal.findById(mealId).populate('cook').populate('participants').exec().then(meal => {
        let removeParticipants = false;

        if (
            dateHelper.compareDates(meal.deliveryDate, req.body['deliveryDate']) !== 0
            ||
            dateHelper.compareDates(meal.limitDate, req.body['limitDate'] !== 0
                ||
                meal.contribution !== req.body['contribution']
            )
        ) {
            removeParticipants = true;
        }

        meal.title = req.body['title'];
        meal.description = req.body['description'];
        meal.deliveryDate = moment(req.body['deliveryDate']).startOf('day').toDate();
        meal.limitDate = moment(req.body['limitDate']).endOf('day').toDate();
        meal.minParticipants = req.body['minParticipants'];
        meal.maxParticipants = req.body['maxParticipants'];
        meal.contribution = req.body['contribution'];

        if (removeParticipants) {
            meal.participants.forEach(participant => {
                Message.create({
                    recipient: participant._id,
                    title: `${participant.name} Some modification has been made to the lunch proposition ${meal.title}`,
                    type: 'message-meal-rejected-from',
                    category: 'warning',
                    data: {
                        meal: meal
                    }
                });
            });

            meal.participants = [];
        }

        meal.save().then(updatedMeal => {
            res.send(updatedMeal);
        });
    });
};

module.exports.getLunchBox = function (req, res) {
    let userId = req.payload._id;
    Meal.getLunchBox(moment(req.params.week), userId, (meals) => {
        res.send(meals);
    });
};

module.exports.create = function (req, res) {
    //hack without this it will force the _id to null
    delete req.body._id;
    let newMeal = new Meal(req.body);
    if (!newMeal.image) {
        let numberHelper = require('../services/number-helper');
        newMeal.image = `image-lunch-default-${numberHelper.getRandomInt(1, 8)}.jpeg`;
    }
    let errors = [];

    if (newMeal.deliveryDate <= newMeal.limitDate) {
        errors.push('limit date should be lower  than delivery date');
    }

    if (newMeal.minParticipants > newMeal.maxParticipants) {
        errors.push('min participants count should be lower or equal than maximum participants count');
    }

    if (errors.length > 0) {
        res.send(500).json({msg: errors});
        return;
    }
    newMeal.deliveryDate = moment(newMeal.deliveryDate).startOf('day').toDate();
    newMeal.limitDate = moment(newMeal.limitDate).endOf('day').toDate();
    newMeal.save().then(meal => {
        Meal.populate(meal, {path: "cook"}).then(cook => res.send(cook));
    });
};

module.exports.join = function (req, res) {
    let mealId = req.params.id;
    let userId = req.payload._id;

    Meal.findById(mealId)
        .populate('cook')
        .populate('participants').exec()
        .then(meal => {
            meal.addParticipant(userId);
            meal.save()
                .then(meal => {
                    User.findById(userId).exec()
                        .then(user => {
                            User.findById(meal.cook).exec()
                                .then((cook) => {
                                    Message.create({
                                        recipient: cook._id,
                                        title: `${user.name} has joined your lunch proposition ${meal.title}`,
                                        type: 'message-meal-join',
                                        category: 'success',
                                        data: {
                                            meal: meal,
                                            joinedBy: user,
                                        }
                                    });
                                    Meal.populate(meal, {path: "participants"}).then(meal => res.send(meal));
                                });
                        });
                });
        });
};

module.exports.leave = function (req, res) {
    let mealId = req.params.id;
    let userId = req.payload._id;

    Meal.findById(mealId)
        .populate('cook')
        .exec().then(meal => {
        meal.removeParticipants(userId);
        meal.save().then(meal => {
            User.findById(userId).exec().then(user => {
                Message.create({
                    recipient: meal.cook._id,
                    title: `${user.name} has left your lunch proposition ${meal.title}`,
                    type: 'message-meal-left',
                    category: 'warning',
                    data: {
                        meal: meal,
                        joinedBy: user,
                    }
                });
                Meal.populate(meal, {path: "participants"}).then(meal => res.send(meal));
            });
        });
    });
};
