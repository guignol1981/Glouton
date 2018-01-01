let express = require('express');
let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let app = express();
let port = process.env.PORT || '3000';
let schedule = require('node-schedule');
let api = require('./server/routes/api');
let scheduledJobs = require('./server/services/scheduled-jobs-service');
require('./server/configs/passport');

app.set('view engine', 'pug');


mongoose.Promise = global.Promise;
if (process.env.DB) {
	mongoose.connect(process.env.DB, { useMongoClient: true });
} else {
	mongoose.connect('mongodb://localhost/lunch-box', { useMongoClient: true });
}

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

//daily jobs at midnight and 1 minutes todo add weekly and monthly jobs
schedule.scheduleJob({hour: 0, minute: 1}, function(){
	scheduledJobs.execute();
});

app.set('port', port);
let server = http.createServer(app);
server.listen(port, () =>  console.log(`LunchBox api running on localhost:${port}`));
