var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const uploadCtrl = require('../controllers/upload');
const {checkSchema} = require('express-validator/check');

router.post('/image/base64', auth.checkLogin, uploadCtrl.upload64);

module.exports = router;