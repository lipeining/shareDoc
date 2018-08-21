const Chat = require('../models/chat');
const Doc = require('../models/doc');
const User = require('../models/user');
const userService = require('./user');
module.exports = {
	getChats,
	createChat
};

/**
 *
 *
 * @param {*} user
 * @param {*} options
 */
async function getChats(user, options) {
	return await Chat.find({
			user: user._id
		})
		.limit(options.pageSize)
		.skip((options.pageIndex - 1) * options.pageSize)
		.populate({path: 'user', select: 'name avatar '})
        .populate({path: 'doc', select: 'collectionName documentId star'})
        .sort({date: -1});
}

/**
 *
 *
 * @param {*} options
 */
async function createChat(options) {
	return await Chat.create(options);
}
