// io 为全局变量
const userMapSocket = require('./mapper')
	.userMapSocket;
module.exports = {
    sendUserIndexMessage,
    sendUserRoomMessage,
	broadcastRoomMessage
}

/**
 *
 *
 * @param {*} userId
 * @param {*} event
 * @param {*} msg
 */
async function sendUserIndexMessage(userId, event, msg) {
	let obj = await userMapSocket.get(userId);
	if (obj) {
		if (obj['index']) {
			for (let i of obj['index']) {
				try {
					// console.log(io);
					// console.log(io.connectd);
					io.sockets.connected[i].emit(event, msg);
				} catch (err) {
					console.log('send index message error');
					console.log(err);
					// 有可能是这个socket已经不存在了，那么直接删除之
					await userMapSocket.remove(userId, i);
					await userMapSocket.attach(userId);
				}
			}
		}
	}
}

/**
 *
 *
 * @param {*} userId
 * @param {*} room
 * @param {*} event
 * @param {*} msg
 */
async function sendUserRoomMessage(userId, room, event, msg) {
	let obj = await userMapSocket.get(userId);
	if (obj) {
		if (obj[room]) {
			for (let i of obj[room]) {
				try {
					io.sockets.connected[i].emit(event, msg);
				} catch (err) {
					console.log(`send user room ${room} message error`);
					console.log(err);
					// 有可能是这个socket已经不存在了，那么直接删除之
					await userMapSocket.remove(userId, i);
					await userMapSocket.attach(userId);
				}
			}
		}
	}
}

/**
 *
 *
 * @param {*} userId
 * @param {*} room
 * @param {*} event
 * @param {*} msg
 */
async function broadcastRoomMessage(room, event, msg) {
	try {
		io.sockets.to(room)
			.emit(event, msg);
	} catch (err) {
		console.log(`send room ${room} message error`);
		console.log(err);
	}
}
