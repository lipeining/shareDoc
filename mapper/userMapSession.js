// const redis = require('../ioredisClient');
// userId: 'session1|session2' 键值对
class userMapSession {
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

	set(userId, sessionString) {
		// 不在乎之前是否已经有对应的session string
		this._map.set(userId, sessionString);
	}

	unshift(userId, sessionString) {
		// 如果之前有session string , 添加到其背后
		// 否则直接增加一个即可
		if (this.has(userId)) {
			let oldSessionString = this._map.get(userId);
			let newSessionString = `${sessionString}|${oldSessionString}`;
			this._map.set(userId, newSessionString);
		} else {
			this._map.set(userId, sessionString);
		}
	}

	append(userId, sessionString) {
		// 如果之前有session string , 添加到其背后
		// 否则直接增加一个即可
		if (this.has(userId)) {
			let oldSessionString = this._map.get(userId);
			let newSessionString = `${oldSessionString}|${sessionString}`;
			this._map.set(userId, newSessionString);
		} else {
			this._map.set(userId, sessionString);
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
			return sessionString.split('|');
		} else {
			return null;
		}
	}

	delete(userId){
		// 如果有，返回true, 如果没有,返回false
		this._map.delete(userId);
	}

	remove(userId, sessionString){
		let sessionArr = this.get(userId);
		if(sessionArr){
			let index = sessionArr.indexOf(sessionString);
			sessionArr.splice(index, 1);
			let str = sessionArr.join('|');
			this.set(userId, str);
		}
	}
}

module.exports = new userMapSession();
