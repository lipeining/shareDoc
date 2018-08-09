var WebSocket = require('ws');
var uuid = require('uuid/v4');
var debug = require('debug')('chat');
var sessionParser = require('./sessionMiddleware')
	.sessionParser;

module.exports = function(server) {
	var wss = new WebSocket.Server({
		// verifyClient: (info, done) => {
		//     console.log('Parsing session from request...');
		//     sessionParser(info.req, {}, () => {
		//         console.log('Session is parsed!');
		//         //
		//         // We can reject the connection by returning false to done(). For example,
		//         // reject here if user is unknown.
		//         //
		//         done(info.req.session);
		//     });
		// },
		noServer: true
	});

	wss.on('connection', function(ws, req) {
		// generate an id for the socket
		ws.id = uuid();
		ws.isAlive = true;

		debug('A new client (%s) connected.', ws.id);
		// 我们可以修改对应的session。可以读取之。
		ws.on('message', function(message) {
			if (message === 'wow') {
				// // do nothing
				// console.log(`WS test message ${message} from user ${req.session.user}`);
				// console.log(req.session.user);
			} else {
				// // Here we can now use session parameters.
				// console.log(`WS message ${message} from user ${req.session.user}`);
				// console.log(req.session.user);
				// // try to reset the session
				// req.session.user = {
				//     id: 2,
				//     name: 'duoyi'
				// };
				// req.session.save();
				ws.send('server to client ttt');
			}
		});
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
