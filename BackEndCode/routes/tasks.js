const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/task');
const Date = require('../models/date');
const date = require('../models/date');
mongoose.connect(process.env.DATABASE_URL);

router.post('/task-list', getTasks, (req, res) => {
    
        res.json(res.taskList);

});

async function getTasks(req, res, next) {
    let taskList;

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

router.post('/create', getDate, async (req, res) => {
    const TASK = new Task(
        {
            name: req.body.name,
            time: req.body.time,
            points: req.body.points,
            date: req.body.date,
            userID: req.body.userID
        }
    ); 

    // if date does not exist yet create one
    if (res.dates.length == 0) {
        const DATE = new Date({
            date: req.body.date,
            userID: req.body.userID,
            points: req.body.points,
            pointsCompleted: 0,
            tasksAssigned: 1
        });

        try {
            const newDate = await DATE.save();
        } catch(error) {
            res.status(400).json({message: error.message});
        }
    } 
    //if the date does exist update the points count
    else {

        let date = res.dates[0];

        try {

            date.points = parseInt(date.points) + parseInt(req.body.points);
            date.tasksAssigned = parseInt(date.tasksAssigned) + 1;
    
            await date.save();
        } catch (error) {
    
            if (date == null) {
                res.status(500).json({message: "No date found."});
              } else {
                res.status(500).json({message: error.message});
              }
        }

    }

    try {
        const newTask = await TASK.save();
        res.status(201).json(newTask);
    } catch(error) {
         res.status(400).json({message: error.message});
    }
});

// update
router.put('/update', getTask, getDate, async (req, res) => {
    let task = res.tasks[0];
    
    let date = res.dates[0];
    console.log(date);
    try {
        //check if the isChecked state has changed
        if (task.isChecked != req.body.isChecked) {

            if (req.body.isChecked == "false" ) {

                date.pointsCompleted = parseInt(date.pointsCompleted) - parseInt(task.points);

            } else {

                date.pointsCompleted = parseInt(date.pointsCompleted) + parseInt(task.points);

            }
            
            await date.save();
        }
    } catch(error) {
        res.status(500).json({message: error.message});
    }
    
    try {
      task.name       = req.body.name
      task.time       = req.body.time
      task.points     = req.body.points
      
      if (req.body.isChecked === "true") {
        task.isChecked = true;
      } else {
        task.isChecked = false;
      }

      await task.save();
    } catch (error) {
      if (task == null) {
        res.status(500).json({message: "No task found."});
      } else {
        res.status(500).json({message: error.message});
      }
    }
});

       // Delete an entry
router.delete("/delete", getDate, getTask, async (req, res) => {
    let task = res.tasks[0];
    let date = res.dates[0];
    try{
        
        //check that there are still tasks so date document is needed
        if (date !== undefined) {
            
            if (parseInt(date.tasksAssigned) > 1) {

                date.points = parseInt(date.points) - parseInt(task.points);

                if (task.isChecked == true) {
                    date.pointsCompleted = parseInt(date.pointsCompleted) - parseInt(task.points);
                }

                date.tasksAssigned = parseInt(date.tasksAssigned) - 1;
                await date.save();
            } else {
                await Date.deleteOne({
                    userID: req.body.userID,
                    date: req.body.date});
            }
        }
    } catch(error) {
        res.status(500).json({message: error.message});
    }

    let result = await Task.deleteOne({_id: req.body._id, userID: req.body.userID});
    res.send(result).status(200);
});


async function getTask(req, res, next) {
    let task;

    try {
        task = await Task.find({
            userID: req.body.userID, 
            _id: req.body._id,
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

async function getDate(req, res, next) {

    let date;
    console.log(req.body.date);
    try {
        date = await Date.find({
                userID: req.body.userID,
                date: req.body.date
        });

        if (date == null) {
            res.dates = null;
            next();
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }

    res.dates = date;
    next();
}

module.exports = router;