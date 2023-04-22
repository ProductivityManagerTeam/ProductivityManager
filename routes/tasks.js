const express = require('express');
const router = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const tasks = require("../models/task.js");
const task = require('../models/task.js');

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

// update
router.put('/update', getTask, async (req, res) => {
    let task = res.tasks[0]

    try {
      task.name       = req.body.name
      task.time       = req.body.time
      task.points     = req.body.points
      task.date       = req.body.date
      task.isChecked  = req.body.isChecked

      await tasks.save();
    } catch (error) {
      if (task == null) {
        res.status(500).json({message: "No task found."});
      } else {
        res.status(500).json({message: error.message});
      }
    }
});

       // Delete an entry
router.delete("/delete", async (req, res) => {
    let result = await tasks.deleteOne({_id: req.body.taskID, userID: req.body.userID});
    res.send(result).status(200);
});


async function getTask(req, res, next) {
    let task;

    try {
        task = await tasks.find({
            userID: req.body.userID, 
            _id: req.body.taskID,
        });

        if (task == null) {
            res.status(404).json({message: "Not Found"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }

    res.tasks = task
    next();
}

module.exports = router;