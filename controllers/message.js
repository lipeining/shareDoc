const msgService = require('../services/message');
const docService = require('../services/doc');
const userService = require('../services/user');
var util = require('util');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const {
	validationResult
} = require('express-validator/check');


module.exports = ErrorHanlder({
    getMessages
});



/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getMessages(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
		pageIndex: req.query.pageIndex || 1,
		pageSize: req.query.pageSize || 10
	};
	let result = await msgService.getMessages(req.session.user, options);
	return next({
		msg: result
	});
}



