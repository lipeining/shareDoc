const _ = require('lodash');
const redis = require('../ioredisClient');
// const Redis = require('ioredis-mock');
// var redis = new Redis({
//   // `options.data` does not exist in `ioredis`, only `ioredis-mock`
// });
// userMapSocket:userId => JSON.stringify(socketMap)
// socketMap = {
// 		index: [],
// 		documentId: []
// 	}
class userMapSocket {
	constructor() {

	}

	async keys() {
		return await redis.keys(`userMapSocket:*`);
	}

	async entries() {
		let keys = await this.keys();
		let result = [];
		for (let key of keys) {
			let value = await redis.get(key);
			result.push({
				k: key,
				v: value
			});
		}
		return result;
	}

	async set(userId, pre, socketId) {
		// 不在乎之前是否已经有对应的socketId
		// let obj = await this.get(userId);
		// if (obj) {
		// 	// do nothing
		// } else {
		// 	obj = {};
		// }
		let obj = {};
		obj[pre] = [socketId];
		return await redis.set(`userMapSocket:${userId}`, JSON.stringify(obj));
	}

	async has(userId) {
		return await redis.exists(`userMapSocket:${userId}`);
	}

	async get(userId) {
		// 如果有，返回json，
		// 如果无，返回Null
		if (await this.has(userId)) {
			let obj = await redis.get(`userMapSocket:${userId}`);
			return JSON.parse(obj) || {};
		} else {
			return null;
		}
	}

	async append(userId, pre, socketId) {
		let obj = await this.get(userId);
		if (obj) {
			// do nothing
		} else {
			obj = {};
		}
		if (!obj[pre]) {
			obj[pre] = [];
		}
		if (obj[pre].indexOf(socketId) === -1) {
			obj[pre].push(socketId);
		}
		return await redis.set(`userMapSocket:${userId}`, JSON.stringify(obj));
	}

	async remove(userId, socketId) {
		// 如果指定pre，那么只会删除对应的pre的。
		let obj = await this.get(userId);
		// console.log(obj);
		if (!obj) {
			// do nothing
			return 0;
		} else {
			for (let [k, v] of Object.entries(obj)) {
				let i = v.indexOf(socketId);
				if (i !== -1) {
					obj[k].splice(i, 1);
				}
			}
			// console.log(obj);
			return await redis.set(`userMapSocket:${userId}`, JSON.stringify(obj));
		}
	}

	async attach(userId) {
		// 清除为空的键值对
		let obj = await this.get(userId);
		if (!obj) {
			// do nothing
		} else {
			for (let [k, v] of Object.entries(obj)) {
				if (v.length) {
					// 如果不为空
					// do nothing
				} else {
					delete obj[k];
				}
			}
			// 如果对象中的值都没有了，那么delete it
			if (_.isEmpty(obj)) {
				await this.delete(userId);
			} else {
				await redis.set(`userMapSocket:${userId}`, JSON.stringify(obj));
			}
		}
	}

	async attachAll() {
		// 清除所有为空的键值对
		let keys = await this.keys();
		for(let k of keys) {
			// 去掉开头的userMapSocket:
			let userId = k.substring(14);
			await this.attach(userId);
		}
	}

	async delete(userId) {
		if (await this.has(userId)) {
			return await redis.del(`userMapSocket:${userId}`);
		} else {
			return 0;
		}
	}
}

module.exports = new userMapSocket();
