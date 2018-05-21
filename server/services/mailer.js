let nodemailer = require('nodemailer');

// usage example
// mailer.sendMail({
// 	from: 'admin@lunch=box-group.com',
// 	to: lunch.cook.email,
// 	subject: ` ${lunch.cook.name}, your lunch named "${lunch.title}" is confirmed!`,
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
