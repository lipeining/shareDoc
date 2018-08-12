const sessionStore = require('./sessionMiddleware')
	.store;

var updateUserSession = function(sessionId, data) {
	sessionStore.get(sessionId, function(err, session) {
		if (err) {
			console.log(`get user session ${sessionId} error`);
			console.log(err);
		} else {
			console.log('updating session data 1 ');
			console.log(sessionId);
			// console.log(session);
			if(session){
				if(!session.user){
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
			}
		}
	});
}
var getSession = async function(){
	return new Promise(function(resolve, reject){
		sessionStore.all(function(err, sessions){
			if(err){
				return reject(err);
			}else{
				return resolve(sessions);
			}
		});
	});
}
module.exports = {
	updateUserSession,
	getSession,
};
