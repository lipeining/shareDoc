// const redis = require('../ioredisClient');
// userId: 'session1|session2' 键值对
class userMapSocket {
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

	set(userId, socketString) {
		// 不在乎之前是否已经有对应的socketString
		this._map.set(userId, socketString);
	}

	unshift(userId, socketString) {
		// 如果之前有socket string , 添加到其背后
		// 否则直接增加一个即可
		if (this.has(userId)) {
			let oldSocketString = this._map.get(userId);
			let newSocketString = `${socketString}|${oldSocketString}`;
			this._map.set(userId, newSocketString);
		} else {
			this._map.set(userId, socketString);
		}
	}

	append(userId, socketString) {
		// 如果之前有socket string , 添加到其背后
		// 否则直接增加一个即可
		if (this.has(userId)) {
			let oldSocketString = this._map.get(userId);
			let newSocketString = `${oldSocketString}|${socketString}`;
			this._map.set(userId, newSocketString);
		} else {
			this._map.set(userId, socketString);
		}
	}

	has(userId) {
		return this._map.has(userId);
	}

	get(userId) {
		// 如果有，返回数组，
		// 如果无，返回Null
		if (this.has(userId)) {
			let socketString = this._map.get(userId);
			return socketString.split('|');
		} else {
			return null;
		}
	}
}

module.exports = new userMapSocket();
