var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoDb = require('./db/index');
const cors = require('cors');
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', index);
app.use('/api/users', users);
app.use('/api/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Input Parsing Section Start */

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.json({
  verify: rawBodySaver
}));
app.use(bodyParser.urlencoded({
  verify: rawBodySaver,
  extended: true,
  parameterLimit: 1000000
}));
app.use(bodyParser.raw({
  verify: rawBodySaver,
  type: function () {
    return true;
  }
}));

app.use(expressSanitizer());

let trimmer = function (req, res, next) {
  deepTrim(req.body);
  logger.silly(req.body);
  next();
};

app.use(trimmer);

/* Input Parsing Section End */

/* Session Section Start */

app.use(session({
  secret: 'whiteHat&*^%',
  saveUninitialized: true,
  resave: true
}));

/* Session Section End */

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('error', function () {
  console.log('adfkjhsdfkn');
})

module.exports = app;
