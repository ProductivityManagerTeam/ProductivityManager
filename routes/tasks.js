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

        taskList = await Task.find({userID: req.body.userID, date: req.body.currentDate});

        if (taskList == null) {

            res.status(404).json({message: "Not Found"});

        }

    } catch (error) {

        res.status(500).json({messag: error.message});
    
    }

    res.taskList = taskList;
    next();
}

router.post('/create', async (req, res) => {
    const TASK = new Task(
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
    let result = await Task.deleteOne({_id: req.body.taskID, userID: req.body.userID});
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