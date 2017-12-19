let express = require('express');
let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let app = express();
let port = process.env.PORT || '3000';
let api = require('./server/routes/api');

require('./server/configs/passport');

mongoose.connect('mongodb://localhost/lunch-box');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());

app.use('/api', api);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(function (err, req, res) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

app.set('port', port);
let server = http.createServer(app);
server.listen(port, () =>  console.log(`LunchBox api running on localhost:${port}`));
