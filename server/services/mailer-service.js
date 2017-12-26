let nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'vincentguillemette1981@gmail.com',
		pass: 'Brocante123!!'
	}
});

let mailOptionsTest = {
	from: '"Fred Foo ?" <foo@blurdybloop.com>',
	to: 'bar@blurdybloop.com, baz@blurdybloop.com',
	subject: 'Hello ✔',
	text: 'Hello world ?',
	html: '<b>Hello world ?</b>'
};

module.exports.sendMail = function(mailOptions) {
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
};
