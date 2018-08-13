// const redis = require('../redis');

module.exports = {
  checkAdmin,
  checkLogin,
  checkNotLogin
};

function checkLogin(req, res, next) {
  if (!req.session.user) {
    return res.json({code: 3});
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    return res.json({code: 3});
  }
  next();
}

function checkAdmin(req, res, next) {
  if (req.session.user.permission !== 90) {
    return res.json({code: 5});
  }
  next();
}
