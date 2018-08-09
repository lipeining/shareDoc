const docService = require('../services/doc');
var util = require('util');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const { validationResult } = require('express-validator/check');

module.exports = ErrorHanlder({
	getDocOps,
	getSnapshots
});

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getDocOps(req, res, next) {
	validationResult(req)
	.throw();
	let from = req.query.from || 0;
	let to = req.query.to || 10;
	let collection = req.query.collection || '';
	let documentId = req.query.documentId || '';
	console.log(collection, documentId);
	let options = {
		from: from,
		to: to,
		collection: collection,
		documentId: documentId
	};
	let result = await docService.getDocOps(options);
	return next({
		msg: result
	});
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getSnapshots(req, res, next) {
	validationResult(req)
		.throw();
	let collection = req.query.collection || '';
	let documentId = req.query.documentId || '';
	console.log(collection, documentId);
	let options = {
		collection: collection,
		documentId: documentId,
		getOps: true
	};
	let snapshots = await docService.getSnapshots(options);
	return next({
		msg: {
			snapshots: snapshots
		}
	});
}
