
module.exports = function (params) {
    if (typeof params === 'function') {
        return catchError(params);
    }
    if (typeof params === 'object') {
        for (let key in params) {
            if (typeof params[key] === 'function') {
                params[key] = catchError(params[key]);
            }
        }
    }
    return params;
}

function catchError(ctrl) {
    return function (req, res, next) {
        let func = ctrl.apply(null, arguments);
        if (func && typeof func.then === 'function') {
            return func.catch((err) => {
                // 在主页面有一个APIhandler生成APIError
                console.log('in error-handler catch an error');
                console.log(err);
                return next(err);
            });
        }
        return func;
    }
}