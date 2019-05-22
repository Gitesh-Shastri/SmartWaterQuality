const mongoose = require('mongoose');

const waterSchema = mongoose.Schema({
	temperature: {
		type: String,
		default: '0'
	},
	Conductivity: {
		type: String,
		default: '0'
	},
	PH: {
		type: String,
		default: '0'
	},
	turbidity: {
		type: String,
		default: '0'
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Water', waterSchema);
