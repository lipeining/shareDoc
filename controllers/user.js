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
async function returnMessage(res, Message) {
    return await res.json({
        code: 0,
        Message: Message
    });
}

async function getUsers(req, res, next) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(422).json({
    //         Message: {
    //             err: errors.array()
    //         },
    //         code: 4
    //     });
    // }

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

async function login(req, res, next) {
    let options = {
        password: req.body.password || '',
        email: req.body.email || '',
        phone: parseInt(req.body.phone) || 0
    };
    let user = await userService.login(options);
    if (user) {
        return await returnMessage(res, {
            user: user
        });
    } else {}
}

async function reg(req, res, next) {
    let newUser = {
        name: req.body.name || '',
        password: req.body.password || '',
        email: req.body.email || '',
        phone: parseInt(req.body.phone) || 0,
        permission: 0,
        intro: req.body.intro || ''
    };

    let [user, created] = await userService.reg(newUser);
    if (created) {
        user.password = '';
        req.session.user = user;
        return await returnMessage(res, {
            user: user
        });
    } else {

    }
}

async function update(req, res, next) {

    let user = {
        id: parseInt(req.body.id) || 0,
        phone: parseInt(req.body.phone) || 0,
        name: req.body.name || '',
        email: req.body.email || '',
        intro: req.body.intro || ''
    };
    let count = await userService.update(user);
    console.log('update return count is:' + count);
    if (count) {
        return await returnMessage(res, {});
    } else {
        return next(new APIError('wrong input', 400));
    }

}

async function logout(req, res, next) {
    req.session.destroy();
    return res.json({
        code: 0
    });
}