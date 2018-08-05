const User = require('../models/user');
module.exports = {
    login,
    reg,
    getUsers,
    getUser,
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
async function getUser(options) {
    let user = await User.findById(options.id);
    return user;
}

/**
 *
 *
 * @param {*} options
 * @returns
 */
async function login(options) {
    return await User.findOne(options);
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