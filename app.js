var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var favicon = require('serve-favicon');
var url = require('url');
var util = require('util');

var httpStatus = require('http-status');
const APIError = require('./tools/APIError');
var sessionParser = require('./sessionMiddleware')
	.sessionParser;
var mongoose = require('mongoose');
mongoose.set('debug', true);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');
var uploadRouter = require('./routes/upload');
var _ = require('lodash');
var app = express();
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(sessionParser);
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
// app.use(bodyParser.json({limit: '10mb'}));
// app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', indexRouter);
app.use('/api/v1/', usersRouter);
app.use('/api/v1/', docsRouter);
app.use('/api/v1/', uploadRouter);
let socketioSession = require('express-socket.io-session');
let ioOptions = { 'destroy upgrade': false };
var iorouter = require('./routes/iorouter');
var io = require('socket.io')
	.listen(server, ioOptions);
// io为全局变量
global.io = io;
io.use(socketioSession(sessionParser));
iorouter(io);
// init websockets servers
var wssShareDB = require('./shareDBServer')
	.wss;
// var wssChat = require('./chatServer').wss;

server.on('upgrade', (request, socket, head) => {
	const pathname = url.parse(request.url)
		.pathname;

	if (pathname === '/sharedb') {
		wssShareDB.handleUpgrade(request, socket, head, (ws) => {
			// 必须传递req
			wssShareDB.emit('connection', ws, request);
		});
	} else if (pathname === '/chat') {
		// wssChat.handleUpgrade(request, socket, head, (ws) => {
		// 	// 必须传递req
		// 	wssChat.emit('connection', ws, request);
		// });
		socket.destroy();
	} else {
		socket.destroy();
	}
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new APIError(`API not found ${req.originalUrl}`, httpStatus.NOT_FOUND);
	return next(err);
});

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
	if (_.isError(err)) {
		console.log(err);
		// 有可能是express-validator的抛出错误
		if (!(err instanceof APIError)) {
			if (_.isArray(err.array())) {
				return res.status(422)
					.json({
						code: 4,
						Message: err.array()
					});
			}
			const apiError = new APIError(err.message, err.status);
			return next(apiError);
		}
		return next(err);
	} else {
		return res.json({
			code: 0,
			Message: err.msg || {}
		});
	}
});

// error handler, send stacktrace only during development
app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
	return res.status(err.status)
		.json({
			code: 4,
			Message: err.message,
			stack: err.stack
		});
});

function start() {
	app.set('port', 5000);
	mongoose.connect('mongodb://db:27017/userdoc')
		.then(function() {
			console.log('MongoDB is connected')
		})
		.catch(function(err) {
			console.log(err);
			console.log('MongoDB connection down');
		});
	server.listen(5000);
	console.log('Listening on http://localhost:5000');
}

if (!module.parent) {
	start();
} else {
	module.exports = app;
}
