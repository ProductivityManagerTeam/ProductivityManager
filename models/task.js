const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Task', taskSchema);