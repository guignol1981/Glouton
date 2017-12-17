let express = require('express');
let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let app = express();
let port = process.env.PORT || '3000';

require('./server/models/user/user');
require('./server/configs/passport');

let api = require('./server/routes/api');

mongoose.connect('mongodb://localhost/lunch-box');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());
app.use('/api', api);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.set('port', port);
let server = http.createServer(app);
server.listen(port, () =>  console.log(`LunchBox api running on localhost:${port}`));
