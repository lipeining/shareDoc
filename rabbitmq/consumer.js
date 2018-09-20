var amqp = require('amqp');
var connection = amqp.createConnection({
	host: 'rabbitmq',
	port: 5672,
	login: 'guest',
	password: 'guest'
}, {
	defaultExchangeName: "amq.topic"
});
const searchService = require('../elasticsearch');
var _exchange = null;

// Report errors
connection.on('error', function(err) {
	console.error('Connection error', err);
});

// Initialize the exchange, queue and subscription
connection.on('ready', function() {
	_exchange = connection.exchange('sharedoc');

	connection.queue('op-queue', function(queue) {
		_queue = queue;
		queue.bind(_exchange, 'op');
		// Subscribe to the queue
		queue
			.subscribe(function(message) {
				// Handle message here
				console.log('Got message');
				let op = JSON.parse(message.data.toString());
				console.log(op);
				let id = `${op.c}-${op.d}-${op.v}`;
				searchService.insertDocDelta(id, op);
			});
	});
});
