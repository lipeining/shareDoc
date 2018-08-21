var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var store = new RedisStore({
	port: 6379, // Redis port
	host: 'redis', // Redis host
	pass: 'admin',
	db: 8
});

var sessionParser = session({
	store: store,
	secret: 'sharedoc',
    resave: true,
    saveUninitialized: true,
	cookie: {
		maxAge: 6000000
	} //100 min
});
module.exports = {
	sessionParser,
	store
};
