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

var admin = require('firebase-admin');

var payload = {
	data: {
		MyKey1: 'Hello'
	}
};

var serviceAccount = require('./smartwaterquality-d3304-firebase-adminsdk-8avp0-d548da1c59.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://smartwaterquality-d3304.firebaseio.com'
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

// cron.schedule('* * * * *', () => {
// 	var water_quality = new Water_quality();
// 	water_quality.user = '5ce163407191c40881e32a99';
// 	water_quality.temperature = '-';
// 	water_quality.Conductivity = Math.floor(Math.random() * (100 - 50) + 50) / 100;
// 	water_quality.PH = Math.floor(Math.random() * (85 - 60) + 60) / 10;
// 	water_quality.turbidity = '-';
// 	water_quality.save();
// 	console.log(water_quality);
// 	console.log('running a task every minute');
// });

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

app.get('/getcontent', (req, res, next) => {
	User.findOne({ useremail: req.query.email })
		.exec()
		.then((user) => {
			Water_quality.find({ user: user._id })
				.select('_id created_at temperature Conductivity PH turbidity')
				.exec()
				.then((doc) => {
					res.status(200).json({ results: doc.reverse() });
				})
				.catch((err) => {
					res.status(200).json({ message: 'Error Occured' });
				});
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
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

app.use('/sendNotification', (req, res, next) => {
	admin
		.messaging()
		.sendToTopic('smart_water', payload)
		.then(function(response) {
			console.log('Successfully sent message:', response);
		})
		.catch(function(error) {
			console.log('Error sending message:', error);
		});
});

app.use('/a', (req, res, next) => {
	var water_quality = new Water_quality();
	water_quality.user = '5ce163407191c40881e32a99';
	water_quality.temperature = '-';
	water_quality.Conductivity = Math.floor(Math.random() * (400 - 200) + 200) / 100;
	water_quality.PH = Math.floor(Math.random() * (130 - 70) + 70) / 10;
	water_quality.turbidity = Math.floor(Math.random() * (85 - 60) + 60) / 10;
	water_quality.save();
	admin
		.messaging()
		.sendToTopic('smart_water', payload)
		.then(function(response) {
			console.log('Successfully sent message:', response);
		})
		.catch(function(error) {
			console.log('Error sending message:', error);
		});
	res.redirect('/');
});

app.use('/n', (req, res, next) => {
	var water_quality = new Water_quality();
	water_quality.user = '5ce163407191c40881e32a99';
	water_quality.temperature = '-';
	water_quality.Conductivity = Math.floor(Math.random() * (300 - 110) + 110) / 100;
	water_quality.PH = Math.floor(Math.random() * (70 - 60) + 60) / 10;
	water_quality.turbidity = Math.floor(Math.random() * (85 - 60) + 60) / 10;
	water_quality.save();
	res.redirect('/');
});

app.use('/p', (req, res, next) => {
	var water_quality = new Water_quality();
	water_quality.user = '5ce163407191c40881e32a99';
	water_quality.temperature = '-';
	water_quality.Conductivity = Math.floor(Math.random() * (300 - 110) + 110) / 100;
	water_quality.PH = Math.floor(Math.random() * (60 - 30) + 30) / 10;
	water_quality.turbidity = Math.floor(Math.random() * (60 - 30) + 30) / 10;
	water_quality.save();
	var payload = {
		data: {
			MyKey1: 'Hello'
		}
	};
	admin
		.messaging()
		.sendToTopic('smart_water', payload)
		.then(function(response) {
			console.log('Successfully sent message:', response);
		})
		.catch(function(error) {
			console.log('Error sending message:', error);
		});
	res.redirect('/');
});

app.use('/', (req, res, next) => {
	Water_quality.find()
		.exec()
		.then((doc) => {
			res.render('index', { doc: doc.reverse() });
		})
		.catch((err) => {
			res.redirect('/login');
		});
});

app.listen(PORT, function() {
	console.log(`listening on PORT ${PORT}`);
});
