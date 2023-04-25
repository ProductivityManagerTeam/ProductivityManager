const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/task');
const Date = require('../models/date');
mongoose.connect(process.env.DATABASE_URL);


// DATA RETRIEVAL //

// return JavaScript
router.get('/task-list', getDateTasks, (req, res) => {
        res.json(res.taskList);
});

// Average Points //

// Total
router.get('/date/points/avg/total', getDates, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        totalPoints += taskList[i].points;
    }
    let average = totalPoints/res.dateList.length;
    res.json({result: average});
});
// Complete
router.get('/date/points/avg/complete', getDates, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        if (taskList.check) totalPoints += taskList[i].points;
    }
    let average = totalPoints/res.dateList.length;
    res.json({result: average});
});
// Missed
router.get('/date/points/avg/missed', getDates, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        if (!taskList.check) totalPoints += taskList[i].points;
    }
    let average = totalPoints/res.dateList.length;
    res.json({result: average});
});

// Points //

// Total
router.get('/points/total', getUserTasks, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        totalPoints += taskList[i].points;
    }
    res.json({result: totalPoints});
});
// Complete
router.get('/points/complete', getUserTasks, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        if (taskList.check) totalPoints += taskList[i].points;
    }
    res.json({result: totalPoints});
});
// Missed
router.get('/points/missed', getUserTasks, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        if (!taskList.check) totalPoints += taskList[i].points;
    }
    res.json({result: totalPoints});
});

// Date's Points //

// Total
router.get('/date/points/total', getDateTasks, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        totalPoints += taskList[i].points;
    }
    res.json({result: totalPoints});
});
// Complete
router.get('/date/points/complete', getDateTasks, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        if(taskList.check) totalPoints += taskList[i].points;
    }
    res.json({result: totalPoints});
});
// Missed
router.get('/date/points/missed', getDateTasks, async (req, res) => {
    let taskList = res.taskList;
    let totalPoints = 0;
    for(let i = 0; i < taskList.length; i++) {
        if(!taskList.check) totalPoints += taskList[i].points;
    }
    res.json({result: totalPoints});
});

// Tasks //

// Total
router.get('/tasks/total', getUserTasks, async (req, res) => {
    res.json({result: res.taskList.length});
});
// Complete
router.get('/tasks/complete', getUserTasks, async (req, res) => {
    res.json({result: res.taskList.find({check: true}).length});
});
// Delete
router.get('/tasks/missed', getUserTasks, async (req, res) => {
    res.json({result: res.taskList.find({check: false}).length});
});

// Date's Tasks //

// Total
router.get('/date/tasks/total', getDateTasks, async (req, res) => {
    res.json({result: res.taskList.length});
});
// Complete
router.get('/date/tasks/complete', getDateTasks, async (req, res) => {
    res.json({result: res.taskList.find({check: true}).length});
 });
// Missed
router.get('/date/tasks/missed', getDateTasks, async (req, res) => {
    res.json({result: res.taskList.find({check: false}).length});
 });


// TASK CRUD //

// create
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
        addToDate(TASK);
        const newTask = await TASK.save();
        res.status(201).json(newTask);
    } catch(error) {
         res.status(400).json({message: error.message});
    }
});
// update
router.put('/update', getThisTask, async (req, res) => {
    let task = res.tasks[0];
    let change = req.body.points-task.points;

    try {
        if (task.check)
            updateDatePoints(task, change);
        if (req.body.check != task.check){
            if (req.body.check){
                updateDatePoints(task, req.body.points);
            }
            else {
                updateDatePoints(task, 0-req.body.points);
            }
        }

        task.name       = req.body.name
        task.time       = req.body.time
        task.points     = req.body.points
        task.date       = req.body.date
        task.check      = req.body.check

      await task.save();
    } catch (error) {
      if (task == null) {
        res.status(500).json({message: "No task found."});
      } else {
        res.status(500).json({message: error.message});
      }
    }
});
// delete
router.delete("/delete", async (req, res) => {
    try{
        subFromDate(req.body);
        let result = await Task.deleteOne({_id: req.body.taskID, userID: req.body.userID});
        res.send(result).status(200);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// MIDDLEWARE //

// search by username & task object id
async function getThisTask(req, res, next) {
    let task;

    try {
        task = await Task.find({
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
// search by username & date
async function getDateTasks(req, res, next) {
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
// search by username
async function getUserTasks(req, res, next) {
    let taskList;

    try {

        taskList = await Task.find({userID: req.body.userID});

        if (taskList == null) {

            res.status(404).json({message: "Not Found"});

        }

    } catch (error) {

        res.status(500).json({messag: error.message});
    
    }

    res.taskList = taskList;
    next();
}
// search by username
async function getDates(req, res, next) {
    let dateList;

    try {

        dateList = await date.find({userID: req.body.userID});

        if (dateList == null) {

            res.status(404).json({message: "Not Found"});

        }

    } catch (error) {

        res.status(500).json({messag: error.message});
    
    }

    res.dateList = dateList;
    next();
}

// DATES CRUD //

// Add to this Date
async function addToDate(task) {
    let DATE = getDate(task);
    if (DATE == null) {
        DATE = new Date (
            {
                date: task.date,
                numTasks: 0,
                points: 0,
                userID: task.userID
            }
        ); 
    }
    else {
        DATE = DATE[0];
    }

    try {
        date.numTasks++;
        if (task.check == true)   
            DATE.points += task.points;

        const newDate = await DATE.save();
        res.status(201).json(newDate);
    } catch(error) {
         res.status(400).json({message: error.message});
    }
};
// Change Points
async function updateDatePoints(task, change){
    let DATE = getDate(task);
    try {
        DATE.points += change;
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
// Decrement from this Date
async function subFromDate(task) {
    let DATE = getDate(task);
    if (DATE == null) {
        res.status(404).json({message: "Not Found"});
    }
    else {
        DATE = DATE[0];
    }

    try {
        DATE.numTasks--;
        if (task.check == true)   
            DATE.points -= task.points;
        if (DATE.numTasks == 0) {
            try{
                let result = await Date.deleteOne({_id: DATE._id, userID: DATE.userID});
                res.send(result).status(200);
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }
        else try {
            const newDate = await DATE.save();
            res.status(201).json(newDate);
        } catch (error) {
             res.status(400).json({message: error.message});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
   }
}
// Toggle Check

async function getDate(task) {
    res.Date = await Date.find({userID: task.userID, date: task.date});
}

module.exports = router;