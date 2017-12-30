let nodemailer = require('nodemailer');

// usage example
// mailer.sendMail({
// 	from: 'admin@lunch=box-group.com',
// 	to: meal.cook.email,
// 	subject: ` ${meal.cook.name}, your meal named "${meal.title}" is confirmed!`,
// 	text: 'Congrats! You can go on cooking',
// 	html: use pug template
// });

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'admin@lunch=box-group.com',
		pass: 'notsosecret123!!'
	}
});

module.exports.sendMail = function (mailOptions) {
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};
