require('dotenv').config();
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
//app.set('port', (process.env.PORT || 3000));
const mongoose = require('mongoose');
const database = 'PRODUCTIVITY_MANAGER';
const collection = 'USERS';
var cors = require('cors')

app.use(cors())

mongoose.connect(process.env.DATABASE_URL);

app.use(express.json());

const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
const statisticsRouter = require('./routes/statistics');

app.use('/users', usersRouter);
app.use('/tasks',tasksRouter);
app.use('/statistics', statisticsRouter);

app.listen(PORT, () => console.log(`Listening on... ${PORT}`));