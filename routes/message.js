var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const msgCtrl = require('../controllers/message');
const {checkSchema} = require('express-validator/check');

router.get('/messages', auth.checkLogin, msgCtrl.getMessages);

module.exports = router;