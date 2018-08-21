const Message = require('../models/message');
const Doc = require('../models/doc');
const User = require('../models/user');
const userService = require('./user');
module.exports = {
    getMessages,
    createMessage
};

/**
 *
 *
 * @param {*} user
 * @param {*} options
 */
async function getMessages(user, options) {
	return await Message.find()
		.limit(options.pageSize)
        .skip((options.pageIndex - 1) * options.pageSize)
        .populate({path: 'toUser', select: 'name avatar '})
        .populate({path: 'doc', select: 'collectionName documentId star'});
}


/**
 *
 *
 * @param {*} options
 */
async function createMessage(options) {
	return await Message.create(options);
}

