const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const tasks = require("../models/task.js");

router.post('/create', async (req, res) => {
    const TASK = new tasks(
        {
            name: req.body.name,
            time: req.body.time,
            points: req.body.points,
            date: req.body.date,
            userID: req.body.userID
        }
    ); 

    try {
        const newTask = await TASK.save();
        res.status(201).json(newTask);
    } catch(error) {
         res.status(400).json({message: error.message});
    }
});

router.delete('/delete', async (req, res) => {
    console.log("Hello World!");
    try {
        tasks.deleteOne();//{userID: req.body.userID, _id: req.body.taskID, date: req.body.date});
        res.status(201);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    /**
     * update statistics to match current? Call update api?
     * will delete also be used for task completion?
     * If so, when do statistic change and when do they not?
     **/
});

async function getTask(req, res, next) {
    let task;

    try {

        task = await tasks.find({userID: req.body.userID, _id: req.body.taskID, date: req.body.date});

        if (task == null) {

            res.status(404).json({message: "Not Found"});

        }

    } catch (error) {

        res.status(500).json({messag: error.message});
    
    }

    res.tasks = task
    next();
}

module.exports = router;