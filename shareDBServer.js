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
var rabbitmq = require('./rabbitmq');
const _ = require('lodash');
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

/**
 *
 *
 * @param {*} request
 * @returns {Boolean} 
 */
function checkUserDocPermission(request) {
	if (!request.agent.connectSession) {
		// in node no session just return true
		return true;
	} else {
		let user = request.agent.connectSession.user;
		if (!user) {
			// not login
			return false;
		}
		let collectionName = request.collection;
		let documentId = request.id;
		let action = request.action;
		if (action == "readSnapshots") {
			// get documentId from the snapshots
			documentId = request.snapshots[0].id;
		}
		let docs = user.docs;
		// console.log(docs);
		console.log(collectionName);
		console.log(documentId);
		for (let doc of docs) {
			if (doc.item.documentId == documentId && doc.item.collectionName == collectionName) {
				return true;
			}
		}
		//no doc map the permission
		return false;
	}
}
// no need to send back the error message the next('message') help us!
// if you want to send message ,use Object ,not string!
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
			// i do  know  it is unable to access collection
			// i do  know  it is unable to access id
			request.agent.connectSession = request.req.session;
			// console.log(`on ${request.action}-start-`);
			// console.log(request.collection);
			// console.log(request.id);
			// console.log(`on ${request.action}-end-`);
			// console.log(request.agent.stream.ws);
			// connect do not check permission
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
	// console.log(request.agent.connectSession);
	// next();
	// i do not know whether it is able to access id
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	next();
	// if(checkUserDocPermission(request)){
	// 	request.agent.stream.ws.send('query permission is ok');
	// 	next();
	// } else {
	// 	request.agent.stream.ws.send('query permission is not ok');			
	// 	next('no permission');
	// }
});
shareDBServer.use('readSnapshots', function(request, next) {
	console.log('sharedb on readSnapshots');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	// console.log(request.agent.connectSession);
	// next();
	// i do  know  it is able to access collection
	// i do  know  it is unable to access id
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(request.snapshots);
	// console.log(request.snapshots.length);
	// console.log(request.snapshots[0]);
	// console.log(request.snapshots[0].id);
	// console.log(`on ${request.action}-end-`);
	// next();
	if (checkUserDocPermission(request)) {
		next();
	} else {
		// request.agent.stream.ws.send('readSnapshots permission is not ok');			
		next('no permission readSnapshots');
	}
});
shareDBServer.use('op', function(request, next) {
	console.log('sharedb on op');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	// console.log(request.agent.connectSession);
	// next();
	// i do  know  it is able to access collection
	// i do  know  it is able to access id
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	next();
	// no need to check op An operation was loaded from the database.
	// if(checkUserDocPermission(request)){
	// 	next();
	// } else {
	// 	request.agent.stream.ws.send('op permission is not ok');			
	// 	next('no permission');
	// }
});
shareDBServer.use('submit', function(request, next) {
	console.log('sharedb on submit');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	// console.log(request.agent.connectSession);
	// next();
	// i do  know  it is able to access collection
	// i do  know  it is able to access id		
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	// next();
	// An operation is about to be submitted to the database
	if (checkUserDocPermission(request)) {
		next();
	} else {
		// request.agent.stream.ws.send('submit permission is not ok');			
		next('no permission submit');
	}
});
shareDBServer.use('apply', function(request, next) {
	console.log('sharedb on apply');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	// console.log(request.agent.connectSession);
	// next();
	// i do  know  it is able to access collection
	// i do  know  it is able to access id		
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	// next();
	// An operation is about to be applied to a snapshot before being committed to the database
	if (checkUserDocPermission(request)) {
		next();
	} else {
		// request.agent.stream.ws.send('apply permission is not ok');			
		next('no permission apply');
	}
});
shareDBServer.use('commit', function(request, next) {
	console.log('sharedb on commit');
	// next();	
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	// next();
	// An operation was applied to a snapshot; The operation and new snapshot are about to be written to the database.
	if (checkUserDocPermission(request)) {
		next();
	} else {
		// request.agent.stream.ws.send('commit permission is not ok');			
		next('no permission commit');
	}
});
shareDBServer.use('afterSubmit', function(request, next) {
	console.log('sharedb on afterSubmit');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	// console.log(request.agent.connectSession);
	// next();
	// i do  know  it is able to access collection
	// i do  know  it is able to access id		
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	// console.log(request.op);
	rabbitmq.provideMsg('op', _.omit(request.op, ['m']));
	// rabbitmq.provideMsg('op', request.op);
	next();
	// if(checkUserDocPermission(request)){
	// 	request.agent.stream.ws.send('afterSubmit permission is ok');
	// 	next();
	// } else {
	// 	request.agent.stream.ws.send('afterSubmit permission is not ok');			
	// 	next('no permission');
	// }
});
shareDBServer.use('receive', function(request, next) {
	console.log('sharedb on receive');
	// console.log(util.inspect(request, {
	// 	depth: 2
	// }));
	// console.log(util.inspect(request.agent.connectSession, {depth: 4}));
	// console.log(request.req.session);
	// console.log(request.agent.connectSession);
	// next();
	// i do  know  it is unable to access collection
	// i do  know  it is unable to access id		
	// console.log(`on ${request.action}-start-`);
	// console.log(request.collection);
	// console.log(request.id);
	// console.log(`on ${request.action}-end-`);
	next();
	// if(checkUserDocPermission(request)){
	// 	request.agent.stream.ws.send('receive permission is ok');
	// 	next();
	// } else {
	// 	request.agent.stream.ws.send('receive permission is not ok');			
	// 	next('no permission');
	// }
});

var wss = new WebSocket.Server({
	// verifyClient: (info, done) => {
	// 	console.log('Parsing session from request db server...');
	// 	sessionParser(info.req, {}, () => {
	// 		console.log('Session is parsed! db server');
	// 		//
	// 		// We can reject the connection by returning false to done(). For example,
	// 		// reject here if user is unknown.
	// 		//
	// 		done(info.req.session);
	// 	});
	// },
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
