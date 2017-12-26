let nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'vincentguillemette1981@gmail.com',
		pass: 'Brocante123!!'
	}
});

module.exports.sendMail = function(mailOptions) {
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};
