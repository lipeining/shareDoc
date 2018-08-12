// const redis = require('../ioredisClient');
// userId: 'session1|session2' 键值对
// userId: JSON.stringify([sessionArr]);
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

	delete(userId){
		// 如果有，返回true, 如果没有,返回false
		this._map.delete(userId);
	}

	remove(userId, sessionString){
		let sessionArr = this.get(userId);
		if(sessionArr){
			let index = sessionArr.indexOf(sessionString);
			// if index === -1
			if(index>=0){
				sessionArr.splice(index, 1);
				this.set(userId, sessionArr);
			}else{
				return 2;// no such sessionString
			}
		}else{
			return 1; // no such user map session 
		}
	}
}

module.exports = new userMapSession();
