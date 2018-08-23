const docService = require('../services/doc');
const userService = require('../services/user');
const msgService = require('../services/message');
var util = require('util');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const {
	validationResult
} = require('express-validator/check');
const userMapSession = require('../mapper')
	.userMapSession;	
const sessionManager = require('../sessionManager');
const socketManager = require('../socketManager');
module.exports = ErrorHanlder({
	createDoc,
	importDoc,
	getDocUsers,
	addDocUser,
	setDocUser,
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
		documentId: req.body.documentId || '',
		users: []
	};
	console.log('createdoc controller');
	console.log(options);
	let result = await docService.createDoc(user, options);
	await docService.createDocData(options);
	// here we update the user session for docs
	let sessionIDArr = await userMapSession.get(user._id);
	console.log(sessionIDArr);
	let data = await userService.getUserByIdWithDocs({ id: user._id });
	// console.log(data);
	if (sessionIDArr) {
		for (let sessionID of sessionIDArr) {
			console.log(sessionID);
			// console.log(data);
			sessionManager.updateUserSession(sessionID, data);
		}
	}
	// one user many session
	sessionManager.updateUserSession(req.session.id, data);
	// update the client user info
	socketManager.sendUserIndexMessage(user._id, 'updateUser', {user: data});
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
async function importDoc(req, res, next) {
	validationResult(req)
		.throw();
	let user = req.session.user;
	let createOptions = {
		creator: user._id,
		collectionName: 'import',
		documentId: req.body.fileName || '',
		users: []
	};
	let importOptions = {
		collectionName: 'import',
		documentId: req.body.fileName || '',
		delta: req.body.delta
	};
	// 导入文档是否需要考虑用户只上传了文档，点击保存的情况
	// 这样的话，需要将文档中的图片放到临时目录，然后在这个接口将文档的图片
	// 放到正确的位置。
	console.log('importdoc controller');
	console.log(createOptions);
	console.log(importOptions);
	let createRes = await docService.createDoc(user, createOptions);
	await docService.importDoc(user, importOptions);
	// here we update the user session for docs
	let sessionIDArr = await userMapSession.get(user._id);
	console.log(sessionIDArr);
	let data = await userService.getUserByIdWithDocs({ id: user._id });
	// console.log(data);
	if (sessionIDArr) {
		for (let sessionID of sessionIDArr) {
			console.log(sessionID);
			// console.log(data);
			sessionManager.updateUserSession(sessionID, data);
		}
	}
	// one user many session
	sessionManager.updateUserSession(req.session.id, data);
	// update the client user info
	socketManager.sendUserIndexMessage(user._id, 'updateUser', {user: data});
	return next({
		msg: createRes
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
async function getDocUsers(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		docId: req.query.docId || '',
		type: req.query.type || 0
	};
	let result = await docService.getDocUsers(req.session.user, options);
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
		userId: req.body.userId || '',
		status: req.body.status || 0
	};
	console.log('add doc user controller');
	// console.log(options);
	if(options.userId == user._id) {
		return next(new APIError('can not add creator status'));
	}
	let content = await docService.addDocUser(user, options);
	let sessionIDArr = await userMapSession.get(options.userId);
	console.log(sessionIDArr);
	if (sessionIDArr) {
		let data = await userService.getUserByIdWithDocs({ id: options.userId });
		for (let sessionID of sessionIDArr) {
			sessionManager.updateUserSession(sessionID, data);
		}
		// update the client user info
		socketManager.sendUserIndexMessage(options.userId, 'updateUser', {user: data});	
	}
	// 添加对应的用户的未读消息记录
    let msg = {
		status: 1,
		toUser: options.userId,
		doc: options.docId,
		content: content
	};
	await msgService.createMessage(msg);
	// 推送系统消息
	socketManager.sendUserIndexMessage(options.userId, 'systemNews', {msg: msg});
	return next({
		msg: {}
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
async function setDocUser(req, res, next) {
	validationResult(req)
		.throw();
	let user = req.session.user;
	let options = {
		docId: req.body.docId || '',
		userId: req.body.userId || '',
		status: req.body.status || 0
	};
	console.log('set doc user controller');
	// console.log(options);
	if(options.userId == user._id) {
		return next(new APIError('can not set creator status'));
	}
	let content = await docService.setDocUser(user, options);
	let sessionIDArr = await userMapSession.get(options.userId);
	console.log(sessionIDArr);
	if (sessionIDArr) {
		let data = await userService.getUserByIdWithDocs({ id: options.userId });
		for (let sessionID of sessionIDArr) {
			sessionManager.updateUserSession(sessionID, data);
		}
		// update the client user info
		socketManager.sendUserIndexMessage(options.userId, 'updateUser', {user: data});	
	}
	// 添加对应的用户的未读消息记录
    let msg = {
		status: 1,
		toUser: options.userId,
		doc: options.docId,
		content: content
	};
	await msgService.createMessage(msg);
	// 推送系统消息
	socketManager.sendUserIndexMessage(options.userId, 'systemNews', {msg: msg});
	return next({
		msg: {}
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
	let options = {};
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
