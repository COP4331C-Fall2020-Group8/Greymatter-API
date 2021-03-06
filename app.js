var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var addCardRouter = require('./routes/addCard');
var removeCardRouter = require('./routes/removeCard');
var addSetRouter = require('./routes/addSet');
var removeSetRouter = require('./routes/removeSet');
var searchCardRouter = require('./routes/searchCard');
var searchSetRouter = require('./routes/searchSet');
var updateCardRouter = require('./routes/updateCard');
var updateSetRouter = require('./routes/updateSet');
var getSetIDRouter = require('./routes/getSetID');
var forgotPasswordRouter = require('./routes/forgotPassword');
var resetPasswordRouter = require('./routes/resetPassword');

var initRouter = require('./routes/init');
var confirmationRouter = require('./routes/confirmation');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use('/', addCardRouter);
app.use('/', addSetRouter);
app.use('/', removeCardRouter);
app.use('/', removeSetRouter);
app.use('/', searchCardRouter);
app.use('/', searchSetRouter);
app.use('/', updateCardRouter);
app.use('/', updateSetRouter);
app.use('/', initRouter);
app.use('/', getSetIDRouter);
app.use('/', confirmationRouter);
app.use('/', forgotPasswordRouter);
app.use('/', resetPasswordRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
