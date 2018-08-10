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
var shareDBServer = new ShareDB({
	db
});
var util = require('util');
var uuid = require('uuid/v4');
var debug = require('debug')('sharedb');
var sessionParser = require('./sessionMiddleware')
	.sessionParser;
// sharedb-access必须在listen中传入req。所以这样才能得到session,才能通过中间件解析session。	
const shareDbAccess = require('sharedb-access');
shareDbAccess(shareDBServer);
// 注意，从1.0beta开始，不支持doc的中间件了,share-access可能会出错

shareDBServer.allowCreate('office', async (docId, doc, session) => {
	console.log('sharedb access create');
	console.log(docId);
	console.log(doc);
	console.log(session);
	return true;
});
shareDBServer.allowRead('office', async (docId, doc, session) => {
	console.log('sharedb access read');
	console.log(docId);
	console.log(doc);
	console.log(session);
	return true;
});
shareDBServer.allowDelete('office', async (docId, doc, session) => {
	console.log('sharedb access delete');
	console.log(docId);
	console.log(doc);
	console.log(session);
	return true;
});
shareDBServer.allowUpdate('office', async (docId, oldDoc, newDoc, session) => {
	console.log('sharedb access update');
	console.log(docId);
	console.log(oldDoc);
	console.log(newDoc);
	console.log(session);
	return true;
});
shareDBServer.use('connect', function(request, next) {
	console.log('sharedb on connnect');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.req, {
	// 	depth: 2
	// }));
	console.log('sharedb Parsing session from request...');
	sessionParser(request.req, {}, () => {
		console.log('sharedb Session is parsed!');
		//
		// 这里保存到agent.connectSession
		request.agent.connectSession = request.req.session;
		next();
	});
	// next();
});
shareDBServer.use('query', function(request, next) {
	console.log('sharedb on query');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	next();
});
shareDBServer.use('readSnapshots', function(request, next) {
	console.log('sharedb on readSnapshots');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	next();
});

module.exports = function(server) {
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

	return wss;
};
