var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var ShareDB = require('sharedb');
var richText = require('rich-text');
ShareDB.types.register(richText.type);
var db = require('./sharedocdb');
// var mongodb = require('mongodb');
// 不能使用
// var db = require('sharedb-mongo')({mongo: function(callback) {
//   mongodb.connect('mongodb://localhost:27017/sharedoc', callback);
// }});
// 不能使用redisClient
// var redisClient = require('./redisClient');
// var redisPubsub = require('sharedb-redis-pubsub')(redisClient); 
// Redis client being an existing redis client connection
// 使用ioredis的options
var ioredisClient = require('./ioredisClient');
var redisPubsub = require('sharedb-redis-pubsub')(ioredisClient.options);
// console.log(ioredisClient);
// 直接使用一个options，让pubsub自己生成客户端
// var redisPubsub = require('sharedb-redis-pubsub')({
// 	port: 6379, // Redis port
// 	host: 'redis', // Redis host
// 	family: 4, // 4 (IPv4) or 6 (IPv6)
// 	password: 'admin',
//     db: 10
// });

var shareDBServer = new ShareDB({
	db: db, // db would be your mongo db or other storage location
	pubsub: redisPubsub
});
var util = require('util');
var uuid = require('uuid/v4');
var debug = require('debug')('sharedb');
var sessionParser = require('./sessionMiddleware')
	.sessionParser;
// sharedb-access必须在listen中传入req。所以这样才能得到session,才能通过中间件解析session。	
// const shareDbAccess = require('sharedb-access');
// shareDbAccess(shareDBServer);
// 注意，从1.0beta开始，不支持doc的中间件了,share-access可能会出错

// shareDBServer.allowCreate('office', async (docId, doc, session) => {
// 	console.log('sharedb access create');
// 	console.log(docId);
// 	console.log(doc);
// 	console.log(session);
// 	return true;
// });
// shareDBServer.allowRead('office', async (docId, doc, session) => {
// 	console.log('sharedb access read');
// 	console.log(docId);
// 	console.log(doc);
// 	console.log(session);
// 	return true;
// });
// shareDBServer.allowDelete('office', async (docId, doc, session) => {
// 	console.log('sharedb access delete');
// 	console.log(docId);
// 	console.log(doc);
// 	console.log(session);
// 	return true;
// });
// shareDBServer.allowUpdate('office', async (docId, oldDoc, newDoc, session) => {
// 	console.log('sharedb access update');
// 	console.log(docId);
// 	console.log(oldDoc);
// 	console.log(newDoc);
// 	console.log(session);
// 	return true;
// });
// 如果是服务器node使用的话，不会有session。

shareDBServer.use('connect', function(request, next) {
	console.log('sharedb on connnect');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.req, {
	// 	depth: 2
	// }));
	console.log('sharedb Parsing session from request...');
	// console.log(request.req.session);
	if (request.req) {
		sessionParser(request.req, {}, () => {
			console.log('sharedb Session is parsed!');
			//
			// 这里保存到agent.connectSession
			request.agent.connectSession = request.req.session;
			next();
		});
	} else {
		next();
	}
	// next();
});
shareDBServer.use('query', function(request, next) {
	console.log('sharedb on query');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	next();
});
shareDBServer.use('readSnapshots', function(request, next) {
	console.log('sharedb on readSnapshots');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	// 无法这样读取collection方法
	// shareDBServer.allowRead(request.collection, async (docId, doc, session) => {
	// 	console.log('sharedb access read');
	// 	console.log(docId);
	// 	console.log(doc);
	// 	console.log(session);
	// 	return true;
	// });
	next();
});
shareDBServer.use('op', function(request, next) {
	console.log('sharedb on op');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	next();
});
shareDBServer.use('submit', function(request, next) {
	console.log('sharedb on submit');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	next();
});
shareDBServer.use('apply', function(request, next) {
	console.log('sharedb on apply');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	next();
});
shareDBServer.use('afterSubmit', function(request, next) {
	console.log('sharedb on afterSubmit');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	next();
});
shareDBServer.use('receive', function(request, next) {
	console.log('sharedb on receive');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	console.log(request.agent.connectSession);
	next();
});

var wss = new WebSocket.Server({
	verifyClient: (info, done) => {
		console.log('Parsing session from request...');
		sessionParser(info.req, {}, () => {
			console.log('Session is parsed!');
			//
			// We can reject the connection by returning false to done(). For example,
			// reject here if user is unknown.
			//
			done(info.req.session);
		});
	},
	noServer: true
});

wss.on('connection', function(ws, req) {

	// generate an id for the socket
	ws.id = uuid();
	ws.isAlive = true;

	debug('A new client (%s) connected.', ws.id);
	var stream = new WebSocketJSONStream(ws);
	// 可以在这里传递req进入shareDBServer，然后在他的中间件中应该可以得到req
	// console.log('wss on connection');
	// console.log(req);
	shareDBServer.listen(stream, req);

	ws.on('pong', function(data, flags) {
		debug('Pong received. (%s)', ws.id);
		ws.isAlive = true;
	});

	ws.on('error', function(error) {
		debug('Client connection errored (%s). (Error: %s)', ws.id, error);
	});
});

// Sockets Ping, Keep Alive
setInterval(function() {
	wss.clients.forEach(function(ws) {
		if (ws.isAlive === false) return ws.terminate();

		ws.isAlive = false;
		ws.ping();
		debug('Ping sent. (%s)', ws.id);
	});
}, 30000);

module.exports = {
	shareDBServer: shareDBServer,
	wss: wss
};
