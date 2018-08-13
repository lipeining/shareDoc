const User = require('../models/user');
const Doc = require('../models/doc');
module.exports = {
	login,
	reg,
	getUsers,
	getUserNames,
	getUserById,
	getUserByIdWithDocs,
	getUserTest,
	update
};

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function getUsers(options) {
	// let reg = new RegExp();
	let users = await User.find()
		.limit(options.pageSize)
		.skip((options.pageIndex - 1) * options.pageSize);
	return users;
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function getUserNames(options) {
	let users = await User.find().select({name: 1});
	return users;
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function getUserById(options) {
	return  await User.findById(options.id);
}


/**
 *
 *
 * @param {*} options
 * @returns
 */
async function getUserByIdWithDocs(options) {
	return  await User.findById(options.id).populate({path: 'docs.item'});
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function getUserTest(options) {
	let user = await User.findById(options.id)
		.populate('docs.item');
	let user2 = await User.findById(options.id)
		.populate({
			path: 'docs.item',
			populate: {
				path: 'users.item'
			}
		});
	let user3 = await User.findById(options.id)
		.populate({
			path: 'docs.item',
			model: Doc,
			populate: {
				path: 'users.item',
				model: User
			}
		});
	return {
		user,
		user2,
		user3
	};
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function login(options) {
	return await User.findOne(options)
		.populate({
			path: 'docs.item'
		});
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function reg(options) {
	let old = await User.findOne({
		eamil: options.email
	});
	if (old) {
		throw new Error('email is used');
	} else {
		return await User.create(options);
	}
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function update(options) {
	return await User.findByIdAndUpdate(options.id, options);
}
