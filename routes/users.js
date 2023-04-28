const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.connect(process.env.DATABASE_URL);

router.post('/login', getUser, (req, res) => {
    if (res.user[0].password == req.body.password) {
        try {
        
            res.status(200).json({id: res.user[0]._id});
            console.log(res.user[0]._id);
        } catch (error) {
            res.status(500).json({message: error});
        }

    } else {

        res.status(400).json({message: "Incorrect Password", id: "Not Found"});
    }

});

router.post('/signup', async (req, res) => {
    const USER = new User(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            Email: req.body.Email,
            password: req.body.password,
            username: req.body.username
        }
    );

    let doesUserExist = await User.find({username: req.body.username});
        console.log(doesUserExist[0]);
    if (doesUserExist[0]) {

        res.json({message: "Username Exists"});

    } 
    
    else {

        try {
            const newUser = await USER.save();
            res.status(201).json(newUser);
        } catch(error) {
            res.status(400).json({message: error.message});
        }

    }
});

async function getUser(req, res, next) {
    let user;

    try {

        user = await User.find({username: req.body.username});

        if (user == null) {

            res.status(404).json({message: "Not Found"});

        }

    } catch (error) {

        res.status(500).json({messag: error.message});
    
    }

    res.user = user
    next();
}

module.exports = router;