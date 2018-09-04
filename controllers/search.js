const searchService = require('../elasticsearch');
const rabbitmq =  require('../rabbitmq');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const { validationResult } = require('express-validator/check');

module.exports = ErrorHanlder({
	pingServer,
	getDocHistory
});

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function pingServer(req, res, next) {
	let ping = await searchService.ping();
	return next({ msg: { result: ping } });
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getDocHistory(req, res, next) {
    let result = await searchService.getDocHistory();
	return next({ msg: result });
}
