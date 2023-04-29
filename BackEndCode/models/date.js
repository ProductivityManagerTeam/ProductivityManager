const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    pointsCompleted: {
        type: Number,
        required: true
    },
    tasksAssigned: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Date', dateSchema);