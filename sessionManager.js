const sessionStore = require('./sessionMiddleware')
	.store;
// 根据情况更新userMapSession
const userMapsession = require('./mapper').userMapSession;
var updateUserSession = function(sessionId, data) {
	let userId; 
	if(typeof data._id === 'string'){
		userId = data._id;
	} else if (typeof data._id === 'object'){
		userId = data._id.valueOf().toString();
	}
	sessionStore.get(sessionId, function(err, session) {
		if (err) {
			console.log(`get user session ${sessionId} error`);
			console.log(err);
			userMapsession.remove(userId, sessionId);
		} else {
			console.log('updating session data 1 ');
			console.log(sessionId);
			// console.log(session);
			if (session) {
				if (!session.user) {
					session.user = {};
				}
				session.user = data;
				console.log('updating session data 2');
				// console.log(session);
				sessionStore.set(sessionId, session, function(err) {
					if (err) {
						console.log(`set user session ${sessionId} error`);
						console.log(err);
					} else {
						console.log(`set user session ${sessionId} success`);
					}
				});
			} else {
				// 如果对应的sessionId没有正确的session
				userMapsession.remove(userId, sessionId);
			}
		}
	});
}
var getSession = async function() {
	return new Promise(function(resolve, reject) {
		sessionStore.all(function(err, sessions) {
			if (err) {
				return reject(err);
			} else {
				return resolve(sessions);
			}
		});
	});
}
module.exports = {
	updateUserSession,
	getSession,
};
