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
app.use(express.json({limit: '10mb'}));
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
const userMapSocket = require('./mapper')
	.userMapSocket;
let ioOptions = { 'destroy upgrade': false };
var io = require('socket.io')
	.listen(server, ioOptions);
io.use(socketioSession(sessionParser));
io.on("connection", function(socket) {
	console.log(`in socket.io socket ${socket.id} connect`);
	socket.on("index", function(data) {
		console.log(socket.handshake.session);
		if(socket.handshake.session.user){
			let userId = socket.handshake.session.user._id;
			userMapSocket.append(userId, 'index', socket.id);
			console.log(`in socket.io socket ${socket.id} send index message`);
			console.log(data);
			socket.emit("index", { msg: "index back to client" });
		} else {
			socket.emit('index', {msg: 'not auth user session index'});
		}
	});
	socket.on("docroom", function(data) {
		// 解析data，将用户加入对应的room
		if(socket.handshake.session.user){
			let documentId = data.documentId;
			let collectionName = data.collectionName;
			let roomName = `${collectionName}-${documentId}`;
			socket.join(roomName);
			console.log(`on doc room ${roomName}`);
			let rooms = Object.keys(socket.rooms);
			console.log(rooms); // [ <socket.id>, '${roomName}' ]
			console.log('servers all room');
			console.log(io.sockets.adapter.rooms);
			let userId = socket.handshake.session.user._id;
			userMapSocket.append(userId, roomName, socket.id);
			io.to(roomName)
				.emit('newUser', { msg: 'io.to a new user has joined the room' });
		} else {
			socket.emit('newUser', {msg: 'not auth user session doc'});
		}

		// // broadcast to everyone in the room
		// useless 
		// socket.to(documentId)
		// 	.emit('newUser', { msg: 'socket.to a new user has joined the room' });
	});
	socket.on('disconnect', function() {
		console.log(`in socket.io socket ${socket.id} disconnect`);
		if(socket.handshake.session.user){
			let userId = socket.handshake.session.user._id;
			userMapSocket.remove(userId, socket.id);
		}
	});
});

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
