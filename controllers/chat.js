const chatService = require('../services/chat');
const docService = require('../services/doc');
const userService = require('../services/user');
var util = require('util');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const {
	validationResult
} = require('express-validator/check');


module.exports = ErrorHanlder({
    getChats
});



/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getChats(req, res, next) {
	validationResult(req)
		.throw();
	let options = {
        docId: req.query.docId || '',
		pageIndex: req.query.pageIndex || 1,
		pageSize: req.query.pageSize || 10
	};
	let result = await chatService.getChats(req.session.user, options);
	return next({
		msg: {
            data: result
        }
	});
}



