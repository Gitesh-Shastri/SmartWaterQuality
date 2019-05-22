const bodyParser = require('body-parser');
const User = require('./models/users');
const Water_quality = require('./models/water_quality_details');
let session = require('express-session');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const app = express();

const MONGODB_URI = 'mongodb://Gitesh:gitesh1@ds119088.mlab.com:19088/warehousecamp';
const PORT = process.env.PORT || 3000;

var cron = require('node-cron');

mongoose.connect(MONGODB_URI, function() {
	console.log('connected to DB');
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.text());
app.use(
	bodyParser.json({
		type: 'application/vnd.api+json'
	})
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

var sess;

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	sess = req.session;
	next();
});

app.get('/login', (req, res, next) => {
	res.render('login');
});

app.get('/send', (req, res, next) => {
	var water_quality = new Water_quality();
	water_quality.user = '5ce163407191c40881e32a99';
	water_quality.temperature = Math.floor(Math.random() * (47 - 38) + 38) + '';
	water_quality.Conductivity = Math.floor(Math.random() * (100 - 50) + 50) / 100;
	water_quality.PH = Math.floor(Math.random() * (85 - 60) + 60) / 10;
	water_quality.turbidity = Math.floor(Math.random() * (85 - 60) + 60) / 10 + '';
	water_quality.save();
	res.status(200).json(water_quality);
});

app.post('/login', (req, res, next) => {
	User.find({ useremail: req.body.email, password: req.body.password })
		.select('username useremail')
		.exec()
		.then((users) => {
			if (users.length > 0) {
				req.session.user = users[0];
				res.status(200).json({ message: 'User Logged In', user: users[0] });
			} else {
				res.status(200).json({ message: 'Invalid Credentials' });
			}
		})
		.catch((errr) => {
			res.status(200).json({ message: 'Some Error Occured' });
		});
});

cron.schedule('* * * * *', () => {
	var water_quality = new Water_quality();
	water_quality.user = '5ce163407191c40881e32a99';
	water_quality.temperature = Math.floor(Math.random() * (47 - 38) + 38) + '';
	water_quality.Conductivity = Math.floor(Math.random() * (100 - 50) + 50) / 100;
	water_quality.PH = Math.floor(Math.random() * (85 - 60) + 60) / 10;
	water_quality.turbidity = Math.floor(Math.random() * (85 - 60) + 60) / 10 + '';
	water_quality.save();
	console.log(water_quality);
	console.log('running a task every minute');
});

app.get('/logout', (req, res, next) => {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/login');
		}
	});
});

app.get('/signup', (req, res, next) => {
	res.render('signup');
});

app.post('/signup', (req, res, next) => {
	let user = new User();
	user.useremail = req.body.email;
	user.password = req.body.password;
	user.username = req.body.username;
	user
		.save()
		.then((doc) => {
			res.status(200).json({ message: 'User Created!', user: doc });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

app.use('/', (req, res, next) => {
	var water_quality = new Water_quality();
	water_quality.user = '5ce163407191c40881e32a99';
	water_quality.temperature = Math.floor(Math.random() * (40 - 30) + 30) + '';
	water_quality.Conductivity = Math.floor(Math.random() * (100 - 50) + 50) / 100;
	water_quality.PH = Math.floor(Math.random() * (85 - 60) + 60) / 10;
	water_quality.turbidity = Math.floor(Math.random() * (85 - 60) + 60) / 10 + '';
	water_quality.save();
	Water_quality.find()
		.exec()
		.then((doc) => {
			res.render('index', { doc: doc });
		})
		.catch((err) => {
			res.redirect('/login');
		});
});

app.listen(PORT, function() {
	console.log(`listening on PORT ${PORT}`);
});
