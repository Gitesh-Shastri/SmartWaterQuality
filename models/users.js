const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	useremail: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		default: '-'
	},
	username: {
		type: String,
		default: '-'
	},
	created_at: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('User', userSchema);
