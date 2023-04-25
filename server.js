require('dotenv').config();
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
app.set('port', (process.env.PORT || 3000));
const mongoose = require('mongoose');
const database = 'PRODUCTIVITY_MANAGER';
const collection = 'USERS';

mongoose.connect(process.env.DATABASE_URL);

app.use(express.json());

const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');

app.use('/users', usersRouter);
app.use('/tasks',tasksRouter);

const port = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on... ${PORT}`));