const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Date = require('../models/date');
mongoose.connect(process.env.DATABASE_URL);

router.post('/results', getDate, (req, res) => {
    let dates = res.dates;
    let totalPoints = 0;
    let totalCompleted = 0;
    let successRate;
    let avgPointsAttempted;
    let avgPointsCompleted;

    for (let i = 0; i < dates.length; i++) {

        totalPoints += dates[i].points;
        totalCompleted += dates[i].pointsCompleted;
    }
    
    successRate = (totalCompleted/totalPoints) * 100;
    avgPointsAttempted = totalPoints/dates.length;
    avgPointsCompleted = totalCompleted/dates.length;

   if (dates != 'undefined') {
    res.status(200).json({
        averagePointsAttemptedPerDay: avgPointsAttempted,
        averagePointsCompletedPerDay: avgPointsCompleted,
        successRate: `${successRate}%`
    });

   } else {
    res.status(500);
   }

});

async function getDate(req, res, next) {

    let date;
    console.log(req.body.userID);
    try {
        date = await Date.find({
                userID: req.body.userID,
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