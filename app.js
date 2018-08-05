var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var url = require('url');

var httpStatus = require('http-status');
const APIError = require('./tools/APIError');
var sessionParser = require('./sessionMiddleware').sessionParser;
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');

var app = express();
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(sessionParser);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', indexRouter);
app.use('/api/v1/', usersRouter);
app.use('/api/v1/', docsRouter);

// init websockets servers
var wssShareDB = require('./shareDBServer')(server);
var wssChat = require('./chatServer')(server);

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/sharedb') {
    wssShareDB.handleUpgrade(request, socket, head, (ws, req) => {
      wssShareDB.emit('connection', ws), req;
    });
  } else if (pathname === '/chat') {
    wssChat.handleUpgrade(request, socket, head, (ws, req) => {
      wssChat.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
 if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError(`API not found ${req.originalUrl}`, httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use(function(err, req, res, next){ // eslint-disable-line no-unused-vars
  return res.status(err.status).json({
    code: 4,
    Message: err.message,
    stack:  err.stack 
  });
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 404);
//   return res.status(400).send({
//     code: 4,
//     Message: {
//       err: 'not found'
//     }
//   });
// });

function start() {
  app.set('port', 5000);
  mongoose.connect('mongodb://localhost:27017/userdoc');
  server.listen(5000);
  console.log('Listening on http://localhost:5000');
}

if (!module.parent) {
  start();
} else {
  module.exports = app;
}