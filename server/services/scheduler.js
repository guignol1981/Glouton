let Lunch = require('../models/lunch');
let Message = require('../models/message');
let mailer = require('../services/mailer-service');

let updateLunchStatus = function () {
	Lunch.getNewFailed(failedList => {
		failedList.forEach(failed => {
			failed.status = 'canceled';
			failed.save().then(lunch => {
				Message.create({
					recipient: lunch.cook._id,
					title: `${lunch.cook.name} your lunch proposition ${lunch.title} was canceled`,
					type: 'message-lunch-canceled',
					category: 'danger',
					data: {
						lunch: lunch
					}
				});
				lunch.participants.forEach(participant => {
					Message.create({
						recipient: participant._id,
						title: `${participant.name}, the lunch proposition ${lunch.title} that you joined is canceled`,
						type: 'message-lunch-participation-canceled',
						category: 'danger',
						data: {
							lunch: lunch
						}
					});
				});
			});
		});
	});
	Lunch.getNewConfirmed(confirmedList => {
		confirmedList.forEach(confirmed => {
			confirmed.status = 'confirmed';
			confirmed.save().then(lunch => {
				Message.create({
					recipient: lunch.cook._id,
					title: `${lunch.cook.name} your lunch proposition ${lunch.title} was confirmed`,
					type: 'message-lunch-confirmed',
					category: 'primary',
					data: {
						lunch: lunch
					}
				});
				lunch.participants.forEach(participant => {
					Message.create({
						recipient: participant._id,
						title: `${participant.name}, the lunch proposition ${lunch.title} that you joined is confirmed!`,
						type: 'message-lunch-participation-confirmed',
						category: 'primary',
						data: {
							lunch: lunch
						}
					});
				});
			});
		});
	});
	console.log('updateLunchStatus job done');
};


let suggestLunchOnNothingPlannedDays = function () {

};

module.exports.execute = function () {
	updateLunchStatus();
};