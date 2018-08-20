const msgService = require('../services/message');
const userMapSocket = require('../mapper')
    .userMapSocket;
const socketManager = require('../socketManager');    
module.exports = {
	onIndex,
	onDisconnection,
	onDocRoom
}

/**
 *
 * @param {*} socket
 * @param {*} data
 */
async function onIndex(socket, data) {
	console.log(socket.handshake.session);
	if (!socket.handshake.session.user) {
		socket.handshake.session.reload(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('reload session done');
			}
		});
	}
	if (socket.handshake.session.user) {
		let userId = socket.handshake.session.user._id;
		await userMapSocket.append(userId, 'index', socket.id);
		console.log(`in socket.io socket ${socket.id} send index message`);
		console.log(data);
		socket.emit("index", { msg: "index back to client" });
	} else {
		socket.emit('index', { msg: 'not auth user session index' });
	}
}

/**
 *
 * @param {*} socket
 * @param {*} data
 */
async function onDisconnection(socket, data) {
	// 解析data，将用户加入对应的room
	if (socket.handshake.session.user) {
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
		await userMapSocket.append(userId, roomName, socket.id);
		await socketManager.broadcastRoomMessage(roomName, 'newUser', { msg: 'io.to a new user has joined the room' });
		// io.to(roomName)
		// 	.emit('newUser', { msg: 'io.to a new user has joined the room' });
	} else {
		socket.emit('newUser', { msg: 'not auth user session doc' });
	}
}

/**
 *
 * @param {*} socket
 */
async function onDocRoom(socket) {
    console.log(`in socket.io socket ${socket.id} disconnect`);
    if (socket.handshake.session.user) {
        let userId = socket.handshake.session.user._id;
        await userMapSocket.remove(userId, socket.id);
        // console.log(await userMapSocket.get(userId));
        await userMapSocket.attach(userId);
        // console.log(await userMapSocket.get(userId));
    }
}
