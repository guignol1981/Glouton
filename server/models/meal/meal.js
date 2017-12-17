let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../user/user');

let mealSchema = new Schema({
	title: String,
	description: String,
	date: Date,
	cook: User.userSchema
});

let Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;