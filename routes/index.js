var express = require('express');
var router = express.Router();
const constants = require('../constants');
/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', {
  //   title: 'Express'
  // });
  return res.json({
    code: 0,
    Message: {
      index: 'index'
    }
  })
});
router.get('/login', function (req, res, next) {
  let i = parseInt(req.query.id) || 1;
  req.session.user = constants.Users[i-1];
  req.session.save();
  return res.json({
    code: 0,
    Message: {
      user: req.session.user
    }
  });
});
router.get('/test', function (req, res, next) {
  return res.json({
    code: 0,
    Message: req.session.user
  });
});
router.get('/logout', (request, response) => {
  console.log('Destroying session');
  request.session.destroy();
  response.send({
    code: 0,
    Message: 'Session destroyed'
  });
});

module.exports = router;