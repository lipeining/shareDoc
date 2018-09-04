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
// Local references to the exchange, queue and consumer tag
var _exchange = null;
var _queue = null;
var _consumerTag = null;

// Report errors
connection.on('error', function(err) {
	console.error('Connection error', err);
});

// Update our stored tag when it changes
// connection.on('tag.change', function(event) {
// 	if (_consumerTag === event.oldConsumerTag) {
// 		_consumerTag = event.consumerTag;
// 		// Consider unsubscribing from the old tag just in case it lingers
// 		_queue.unsubscribe(event.oldConsumerTag);
// 	}
// });

// Initialize the exchange, queue and subscription
connection.on('ready', function() {
	// console.log(connection);
	// connection.exchange('exchange-name', function(exchange) {
	// 	_exchange = exchange;
    //     console.log(_exchange);
    //     console.log(exchange);
		connection.queue('op-queue', function(queue) {
			_queue = queue;
			// console.log('_queue');
			// console.log(_queue);
			// Bind to the exchange
            queue.bind('amq.topic', 'op');
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
	// });
});

/**
 *
 *
 * @param {*} routingKey
 * @param {*} data
 */
async function provideMsg(routingKey, data) {
    connection.publish(routingKey, JSON.stringify(data));
}

module.exports = {
    provideMsg
}
// Some time in the future, you'll want to unsubscribe or shutdown 
// setTimeout(function() {
//     console.log(_queue);
//     console.log(_exchange);
//     console.log(_consumerTag);
// 	if (_queue) {
// 		_queue
// 			.unsubscribe(_consumerTag)
// 			.addCallback(function() {
//                 // unsubscribed
//                 console.log('unsubscribed');
// 			});
// 	} else {
//         // unsubscribed
//         console.log('no _queue');
// 	}
// }, 60000);
