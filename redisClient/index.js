const redis = require('redis');
const client = redis.createClient({
	port: 6379, // Redis port
	host: 'redis', // Redis host
	family: 4, // 4 (IPv4) or 6 (IPv6)
	password: 'admin',
    db: 8
});

client.on('ready', function() {
	console.info('client server is ready');
});

client.on('connect', function() {
	console.info('client server is connected');
});

client.on('error', function(err) {
	console.error('client connected fail.');
	console.error(err);
	process.exit(-1);
});

module.exports = client;