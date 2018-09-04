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
	// console.log(connection);
	_exchange = connection.exchange('sharedoc');
	// console.log(_exchange);
	connection.queue('op-queue', function(queue) {
		_queue = queue;
		// console.log(_queue);
		// Bind to the exchange
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

/**
 *
 *
 * @param {*} routingKey
 * @param {*} data
 */
async function provideMsg(routingKey, data) {
	if (_exchange) {
		_exchange.publish(routingKey, JSON.stringify(data));
	} else {
		console.log('no _exchange');
	}
}

module.exports = {
	provideMsg
}
