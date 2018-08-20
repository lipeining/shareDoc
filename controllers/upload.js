const uploadService = require('../services/upload');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
const { validationResult } = require('express-validator/check');

module.exports = ErrorHanlder({
	upload64
});

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function upload64(req, res, next) {
    let str = req.body.str || '';
    let name = req.body.name || '';
    let url = await uploadService.upload64(str, name);
    return next({msg: {url: url}});
}


