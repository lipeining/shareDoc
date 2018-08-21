const msgService = require('../services/message');
const chatService = require('../services/chat');
const userMapSocket = require('../mapper')
	.userMapSocket;
const socketManager = require('../socketManager');
module.exports = {
	onIndex,
	onDisconnection,
	onDocRoom,
	onChat
}

/**
 *
 * @param {*} socket
 * @param {*} data
 */
async function onIndex(socket, data) {
	console.log(socket.handshake.session);
	if (!socket.handshake.session.user) {
		socket.emit('index', { msg: 'not auth user session index', success: 0 });
	} else {
		let userId = socket.handshake.session.user._id;
		await userMapSocket.append(userId, 'index', socket.id);
		console.log(`in socket.io socket ${socket.id} send index message`);
		console.log(data);
		socket.emit("index", { msg: "index back to client", success: 1 });
	}
}

/**
 *
 * @param {*} socket
 * @param {*} data
 */
async function onDocRoom(socket, data) {
	// 解析data，将用户加入对应的room
	if (socket.handshake.session.user) {
		// 在这里加入socket.docId;
		socket.docId = data.docId;
		socket.documentId = data.documentId;
		socket.collectionName = data.collectionName;
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
 * @param {*} data
 */
async function onChat(socket, data) {
	console.log(`in socket.io socket ${socket.id} on chat`);
	// 创建chat记录
	let user = socket.handshake.session.user;
	let options = {
		user: user._id,
		content: data.content,
		ref: data.ref || '',
		doc: socket.docId
	}
	let chat = await chatService.createChat(options);
	let roomName = `${socket.collectionName}-${socket.documentId}`;
	await socketManager.broadcastRoomMessage(roomName, 'chat', { chat: chat });
}

/**
 *
 * @param {*} socket
 */
async function onDisconnection(socket) {
	console.log(`in socket.io socket ${socket.id} disconnect`);
	if (socket.handshake.session.user) {
		let userId = socket.handshake.session.user._id;
		await userMapSocket.remove(userId, socket.id);
		// console.log(await userMapSocket.get(userId));
		await userMapSocket.attach(userId);
		// console.log(await userMapSocket.get(userId));
	}
}
