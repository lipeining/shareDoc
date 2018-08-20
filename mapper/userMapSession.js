const _ = require('lodash');
const redis = require('../ioredisClient');
// const Redis = require('ioredis-mock');
// var redis = new Redis({
//   // `options.data` does not exist in `ioredis`, only `ioredis-mock`
// });
// userMapSession:userId => JSON.stringify([])
class userMapSession {
	constructor() {

	}

	async keys() {
		return await redis.keys(`userMapSession:*`);
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

	async set(userId, sessionId) {
		// 不在乎之前是否已经有对应的sessionId
		let obj = [sessionId];
		return await redis.set(`userMapSession:${userId}`, JSON.stringify(obj));
	}

	async has(userId) {
		return await redis.exists(`userMapSession:${userId}`);
	}

	async get(userId) {
		// 如果有，返回json，
		// 如果无，返回Null
		if (await this.has(userId)) {
			let obj = await redis.get(`userMapSession:${userId}`);
			return JSON.parse(obj) || [];
		} else {
			return null;
		}
	}

	async append(userId, sessionId) {
		let obj = await this.get(userId);
		if (obj) {
			// do nothing
		} else {
			obj = [];
		}
		if (obj.indexOf(sessionId) === -1) {
			obj.push(sessionId);
		}
		return await redis.set(`userMapSession:${userId}`, JSON.stringify(obj));
	}

	async remove(userId, sessionId) {
		let obj = await this.get(userId);
		if (!obj) {
			// do nothing
			return 2;
		} else {
			let i = obj.indexOf(sessionId);
			if (i >= 0) {
				obj.splice(i, 1);
				await redis.set(`userMapSession:${userId}`, JSON.stringify(obj));
				return 0;
			} else {
				// no such sessionId
				return 1;
			}
		}
	}

	async attach(userId) {
		// 清除为空的键值对
		let obj = await this.get(userId);
		if (!obj) {
			// do nothing
		} else {
			// 如果对象中的值都没有了，那么delete it
			if (_.isEmpty(obj)) {
				await this.delete(userId);
			}
			// 考虑，使用sessionManager查看对应的session是否已经被删除了，然后更新这个mapper
		}
	}

	async attachAll() {
		// 清除所有为空的键值对
		let keys = await this.keys();
		for(let k of keys) {
			// 去掉开头的userMapSession:
			let userId = k.substring(15);
			await this.attach(userId);
		}
	}

	async delete(userId) {
		if (await this.has(userId)) {
			return await redis.del(`userMapSession:${userId}`);
		} else {
			return 0;
		}
	}
}

// userId: 'session1|session2' 键值对
// userId: JSON.stringify([sessionArr]);
class userMapSessionMemory {
	constructor() {
		this._map = new Map();
		// this._map = {};
	}

	keys() {
		return this._map.keys();
	}

	entries() {
		return this._map.entries();
	}

	set(userId, sessionArr) {
		// 不在乎之前是否已经有对应的session arr
		this._map.set(userId, JSON.stringify(sessionArr));
	}

	unshift(userId, sessionString) {
		// 如果之前有session string , 添加到其zhi后
		// 否则直接增加一个即可
		if (this.has(userId)) {
			let sessionArr = this.get(userId);
			sessionArr.unshift(sessionString);
			this.set(userId, sessionArr);
		} else {
			this.set(userId, [sessionString]);
		}
	}

	append(userId, sessionString) {
		// 如果之前有session string , 添加到其背后
		// 否则直接增加一个即可
		if (this.has(userId)) {
			let sessionArr = this.get(userId);
			sessionArr.push(sessionString);
			this.set(userId, sessionArr);
		} else {
			this.set(userId, [sessionString]);
		}
	}

	has(userId) {
		return this._map.has(userId);
	}

	get(userId) {
		// 如果有，返回数组，
		// 如果无，返回Null
		if (this.has(userId)) {
			let sessionString = this._map.get(userId);
			return JSON.parse(sessionString);
		} else {
			return null;
		}
	}

	isEmpty(userId) {
		let sessionArr = this.get(userId);
		// if sessionArr is null or sessionArr.length === 0
		return !sessionArr || !!sessionArr.length;
	}

	delete(userId) {
		// 如果有，返回true, 如果没有,返回false
		this._map.delete(userId);
	}

	remove(userId, sessionString) {
		let sessionArr = this.get(userId);
		if (sessionArr) {
			let index = sessionArr.indexOf(sessionString);
			// if index === -1
			if (index >= 0) {
				sessionArr.splice(index, 1);
				this.set(userId, sessionArr);
			} else {
				return 2; // no such sessionString
			}
		} else {
			return 1; // no such user map session 
		}
	}
}

module.exports = new userMapSession();
