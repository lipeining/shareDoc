const docService = require('../services/doc');
var util = require('util');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const {
	validationResult
} = require('express-validator/check');

module.exports = ErrorHanlder({
	createDoc,
	addDocUser,
	getDocs,
	getDoc,
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
async function createDoc(req, res, next) {
	validationResult(req)
		.throw();
	let user = req.session.user;
	let options = {
		creator: user._id,
		collectionName: req.body.collectionName || '',
		documentId: req.body.documentId || ''
	};
	console.log('createdoc controller');
	console.log(options);
	let result = await docService.createDoc(user, options);
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
async function addDocUser(req, res, next) {
	validationResult(req)
		.throw();
	let user = req.session.user;
	let options = {
		docId: req.body.docId || '',
		userId: req.body.userId || ''
	};
	console.log('add doc user controller');
	console.log(options);
	let result = await docService.addDocUser(user, options);
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
async function getDoc(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		id: req.query.id || ''
	};
	let result = await docService.getDocTest(req.session.user, options);
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
async function getDocs(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		pageIndex: req.query.pageIndex || 1,
		pageSize: req.query.pageSize || 10
	};
	let result = await docService.getDocs(req.session.user, options);
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
async function getDocOps(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		from: req.query.from || 0,
		to: req.query.to || 10,
		collectionName: req.query.collectionName || '',
		documentId: req.query.documentId || ''
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
	let options = {
		collectionName: req.query.collectionName || '',
		documentId: req.query.documentId || '',
		getOps: true
	};
	let snapshots = await docService.getSnapshots(options);
	return next({
		msg: {
			snapshots: snapshots
		}
	});
}
