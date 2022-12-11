const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
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



// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};




// catch 404 and foward to error handler
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = 'Sorry, the route could not be found';
  res.render();
  next(err);
});
// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log();
  res.render('error', {});
});


module.exports = app;
