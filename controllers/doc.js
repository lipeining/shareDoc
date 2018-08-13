const docService = require('../services/doc');
const userService = require('../services/user');
var util = require('util');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const {
	validationResult
} = require('express-validator/check');
const userMapSession = require('../mapper').userMapSession;
const sessionManager = require('../sessionManager');
module.exports = ErrorHanlder({
	createDoc,
	addDocUser,
	getMyDocNames,
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
	// here we update the user session for docs
	let sessionIDArr = await userMapSession.get(user._id);
	let data = await userService.getUserByIdWithDocs({id: user._id});
	console.log(sessionIDArr);
	// console.log(data);
	if(sessionIDArr){
		// let data = await userService.getUserByIdWithDocs({id: options.userId});
		for(let sessionID of sessionIDArr){
			console.log(sessionID);
			// console.log(data);
			sessionManager.updateUserSession(sessionID, data);
		}
	}
	// one user many session
	sessionManager.updateUserSession(req.session.id, data);
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

	let sessionIDArr = await userMapSession.get(options.userId);
	console.log(sessionIDArr);
	if(sessionIDArr){
		let data = await userService.getUserByIdWithDocs({id: options.userId});
		for(let sessionID of sessionIDArr){
			sessionManager.updateUserSession(sessionID, data);
		}		
	}
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
async function getMyDocNames(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
	};
	let docs = await docService.getMyDocNames(req.session.user, options);
	return next({
		msg: {
			docs: docs
		}
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
