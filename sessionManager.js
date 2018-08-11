const sessionStore = require('./sessionMiddleware')
	.store;

var updateUserSession = function(sessionId, data) {
	sessionStore.get(sessionId, function(err, session) {
		if (err) {
			console.log(`get user session ${sessionId} error`);
			console.log(err);
		} else {
			session.user = data;
			console.log('updating session data');
			sessionStore.set(sessionId, session, function(err) {
				if (err) {
					console.log(`set user session ${sessionId} error`);
					console.log(err);
				} else {
					console.log(`set user session ${sessionId} success`);
				}
			});
		}
	});
}

module.exports = {
    updateUserSession
};
