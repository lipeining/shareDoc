const userService = require('../services/user');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const { validationResult } = require('express-validator/check');
const userMapSession = require('../mapper').userMapSession;
const userMapSocket = require('../mapper').userMapSocket;
const sessionManager = require('../sessionManager');

module.exports = ErrorHanlder({
	getUsers,
	getUserNames,
	getUser,
	getUserMap,
	getUserSocket,
	getUserSession,
	login,
	reg,
	update,
	logout,
});

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getUsers(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		pageIndex: req.query.pageIndex || 1,
		pageSize: req.query.pageSize || 10,
		search: req.query.search || ''
	};
	let users = await userService.getUsers(options);
	return next({
		msg: {
			users: users
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
async function getUserNames(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		search: req.query.search || ''
	};
	let users = await userService.getUserNames(options);
	return next({
		msg: {
			users: users
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
async function getUser(req, res, next) {
	validationResult(req)
		.throw();
	let user =  await userService.getUserTest({id: req.query.id});
	return next({
		msg: {
			user: user
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
async function getUserMap(req, res, next){
	let arr = await userMapSession.entries()
	console.log(await userMapSession);
	console.log(await userMapSession.entries());
	return next({msg: arr});
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getUserSocket(req, res, next){
	let arr = await userMapSocket.entries()
	console.log(await userMapSocket);
	console.log(await userMapSocket.entries());
	return next({msg: arr});
}


/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getUserSession(req, res, next){
	let sessions = await sessionManager.getSession();
	return next({msg: sessions});
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function login(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		password: req.body.password || '',
		email: req.body.email || ''
	};
	let user = await userService.login(options);
	if (user) {
		user.password = '';
		req.session.user = user;
		// req.session.save();
		// here 添加user map session
		console.log('login');
		console.log(user._id);
		console.log(typeof user._id); // Object
		userMapSession.append(user._id.valueOf().toString(), req.session.id);
		sessionManager.updateUserSession(req.session.id, user);
		return next({
			msg: {
				user: user
			}
		});
	} else {
		return next(new APIError('user not found', 400))
	}
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function reg(req, res, next) {
	validationResult(req)
		.throw();
	let newUser = {
		name: req.body.name || '',
		password: req.body.password || '',
		email: req.body.email || '',
		permission: 0,
		intro: req.body.intro || ''
	};
	let user = await userService.reg(newUser);
	user.password = '';
	req.session.user = user;
	userMapSession.append(user._id.valueOf().toString(), req.session.id);
	sessionManager.updateUserSession(req.session.id, user);
	return next({
		msg: {
			user: user
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
async function update(req, res, next) {
	validationResult(req)
		.throw();
	let user = {
		id: req.session.user._id || 0,
		name: req.body.name || '',
		email: req.body.email || '',
		intro: req.body.intro || ''
	};
	let count = await userService.update(user);
	if (count) {
		return next({});
	} else {
		return next(new APIError('wrong input', 400));
	}
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function logout(req, res, next) {
	console.log('logout');
	console.log(req.session.user._id);
	console.log(typeof req.session.user._id); // String
	await userMapSession.remove(req.session.user._id, req.session.id);
	await userMapSession.attach(req.session.user._id);
	req.session.destroy();
	console.log('session destroy');
	return res.json({});
}
