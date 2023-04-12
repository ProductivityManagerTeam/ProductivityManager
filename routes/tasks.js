const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/task');
mongoose.connect(process.env.DATABASE_URL);

router.get('/task-list', getTasks, (req, res) => {
    
        res.json(res.taskList);

});

async function getTasks(req, res, next) {
    let tasklist;

    try {

        taskList = await Task.find({userID: req.body.userID, currentDate: req.body.currentDate});

        if (taskList == null) {

            res.status(404).json({message: "Not Found"});

        }

    } catch (error) {

        res.status(500).json({messag: error.message});
    
    }

    res.taskList = taskList;
    next();
}

module.exports = router;