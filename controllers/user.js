const userService = require('../services/user');
const APIError = require('../tools/APIError');
const ErrorHanlder = require('../tools/error-handler');
module.exports = ErrorHanlder({
    getUsers,
    getUser,
    login,
    reg,
    update,
    logout,
});
/**
 *
 *
 * @param {*} res
 * @param {*} Message
 * @returns
 */
async function returnMessage(res, Message) {
    return await res.json({
        code: 0,
        Message: Message
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
async function getUsers(req, res, next) {
    let pageIndex = parseInt(req.query.pageIndex) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let options = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        search: req.query.search || ''
    };
    let users = await userService.getUsers(options);
    return await returnMessage(res, {
        users: users
    });
}

async function getUser(req, res, next) {
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
async function login(req, res, next) {
    let options = {
        password: req.body.password || '',
        email: req.body.email || ''
    };
    let user = await userService.login(options);
    user.password = '';
    req.session.user = user;
    if (user) {
        return await returnMessage(res, {
            user: user
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
    return await returnMessage(res, {
        user: user
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
    let user = {
        id: parseInt(req.body.id) || 0,
        name: req.body.name || '',
        email: req.body.email || '',
        intro: req.body.intro || ''
    };
    let count = await userService.update(user);
    if (count) {
        return await returnMessage(res, {});
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
    req.session.destroy();
    console.log('session destroy');
    return res.json({
        code: 0
    });
}