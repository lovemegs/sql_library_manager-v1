const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const pug = require('pug');
const db = require('./models');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const sequelize = require('./models').sequelize;


const app = express();

// Authenticate and sync
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database has been successful');
    await db.sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database', error);
  }
}) ();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and foward to error handler
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = 'Sorry, the route could not be found';
  res.render('page-not-found', { error });
  next(err);
});
// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.status !== 404) {
    err.status = 500;
    err.message = 'Something went wrong on the server';
    console.log(err.message, err.status);
    res.render('error', { err });
  }
});


module.exports = app;
