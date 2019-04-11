const bodyParser = require('body-parser');
const User = require('./models/users');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const app = express();

const MONGODB_URI = "mongodb://Gitesh:gitesh1@ds119088.mlab.com:19088/warehousecamp";
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI,  function () {
    console.log('connected to DB');
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/login', (req, res, next) => {
    User.find({useremail: req.query.email, password: req.query.password})
    .select('username useremail')
    .exec()
    .then( users => {
        if(users.length > 0) {
            res.status(200).json({ message: 'User Found', user: users[0] });
        } else {
            res.status(200).json({ message: 'Invalid Credentials'});    
        }
    })
    .catch( errr => {
        res.status(200).json({ message: 'Some Error Occured' });
    })
});

app.post('/sign_up', (req, res, next) => {

    let user = new User();
    user.useremail = req.body.email;
    user.password = req.body.password;
    user.username = req.body.username;
    user.save().then(doc=> {
        res.status(200).json({message: 'User Created!', user: doc });
    }).catch(err => {
        res.status(200).json({message: 'Error Occured'});    
    });
});

app.use('/', (req, res, next) => {
    res.status(200).json({
        message: "API Documentation"
    })
});

app.listen(PORT, function () {
    console.log(`listening on PORT ${PORT}`);
});
