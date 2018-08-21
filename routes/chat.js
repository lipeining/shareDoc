var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const chatCtrl = require('../controllers/chat');
const {checkSchema} = require('express-validator/check');

router.get('/chats', auth.checkLogin, chatCtrl.getChats);

module.exports = router;