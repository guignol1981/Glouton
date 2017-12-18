let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../user/user');

let mealSchema = new Schema({
	title: String,
	description: String,
	date: Date,
	cook: {type: Schema.Types.ObjectId, ref: 'User'},
	minParticipants: Number,
	participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

let Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;