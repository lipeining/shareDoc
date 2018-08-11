const userService = require('../services/user');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const { validationResult } = require('express-validator/check');
const userMapSession = require('../mapper').userMapSession;

module.exports = ErrorHanlder({
	getUsers,
	getUser,
	getUserMap,
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
async function getUser(req, res, next) {
	validationResult(req)
		.throw();
	let user =  await userService.getUserTest({id: req.query.id});
	return next({
		msg: {
			user: user
		}
	});
	// throw new APIError('in test throw an error', 401);
	// return next(new APIError('in test next an error', 400));
	// let options = {
	//     id: parseInt(req.query.id) || 0
	// };

	// let user = userService.getUser(options);
	// return await returnMessage(res, {
	//     user: user
	// });
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
	let str = '';
	for (let [key, value] of userMapSession.entries()) {
		str += `${key}  =  ${value} \n`;
	}
	return next({msg: str});
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
	user.password = '';
	req.session.user = user;
	// here 添加user map session
	userMapSession.append(user.name, req.session.id);
	if (user) {
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
	userMapSession.remove(req.session.user.name, req.session.id);
	req.session.destroy();
	console.log('session destroy');
	return res.json({});
}
