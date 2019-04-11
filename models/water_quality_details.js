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
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', waterSchema);