var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var ShareDB = require('sharedb');
var richText = require('rich-text');
ShareDB.types.register(richText.type);
var db = require('./db');
// var mongodb = require('mongodb');
// 不能使用
// var db = require('sharedb-mongo')({mongo: function(callback) {
//   mongodb.connect('mongodb://localhost:27017/sharedoc', callback);
// }});
var shareDBServer = new ShareDB({
    db
});
var uuid = require('uuid/v4');
var debug = require('debug')('sharedb');
// const shareDbAccess = require('sharedb-access');
// shareDbAccess(shareDBServer);
var sessionParser = require('./sessionMiddleware').sessionParser;
module.exports = function (server) {
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

    wss.on('connection', function (ws, req) {

        // generate an id for the socket
        ws.id = uuid();
        ws.isAlive = true;

        debug('A new client (%s) connected.', ws.id);

        var stream = new WebSocketJSONStream(ws);
        shareDBServer.listen(stream);

        ws.on('pong', function (data, flags) {
            debug('Pong received. (%s)', ws.id);
            ws.isAlive = true;
        });

        ws.on('error', function (error) {
            debug('Client connection errored (%s). (Error: %s)', ws.id, error);
        });
    });

    // Sockets Ping, Keep Alive
    setInterval(function () {
        wss.clients.forEach(function (ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping();
            debug('Ping sent. (%s)', ws.id);
        });
    }, 30000);

    return wss;
};