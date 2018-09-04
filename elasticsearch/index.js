const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
	host: 'elasticsearch:9200',
	log: 'trace',
	apiVersion: '5.6'
});

module.exports = {
	ping,
	insertDocDelta,
	getDocHistory
};

/**
 *
 *
 * @returns
 */
async function ping() {
	await client.ping({ requestTimeout: 1000 });
	console.log('elastic search ping done');
	return 'elastic search ping done';
}

/**
 *
 *
 * @returns
 */
async function getDocHistory() {
	const response = await client.search({
		index: 'website',
		type: 'blog',
		body: {
			query: {}
		}
	})

	return response;
}

/**
 *
 *
 * @param {*} id
 * @param {*} op
 */
async function insertDocDelta(id, op) {
	await client.create({
		index: 'document',
		type: 'op',
		id: id,
		body: op
	});
}

/**
 *
 *
 * @param {*} opList
 */
async function bulkInsertDocOpList(opList) {

}
