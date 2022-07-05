'use strict';

const express = require('express');
const morgan = require('morgan');   //Logging middleware
const cors = require('cors');
const passport = require('./passport');
const session = require('express-session');   //Enable sessions

//Init express
const app = express();
const port = 3001;

//Set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

//Set up the session
app.use(session({
  secret: 'Esame applicazioni Web 1 - primo appello',
  resave: false,
  saveUninitialized: false 
}));

//Init passport
app.use(passport.initialize());
app.use(passport.session());

//Routers
const studentsRouter = require("./routers/studentRouter");
const coursesRouter = require("./routers/courseRouter");
const studyPlanRouter = require("./routers/studyPlanRouter");

app.use('/api', studentsRouter);
app.use('/api', coursesRouter);
app.use('/api', studyPlanRouter);

//Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;