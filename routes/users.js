var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const userCtrl = require('../controllers/user');
const { checkSchema } = require('express-validator/check');
const userValidateSchema = require('./userValidateSchema');
/* GET users listing. */
router.get('/users/list', auth.checkLogin, checkSchema(userValidateSchema.getUsers), userCtrl.getUsers);

/* GET users list for add doc user. */
router.get('/users/name', auth.checkLogin, checkSchema(userValidateSchema.getUserNames), userCtrl.getUserNames);

/* GET user  */
router.get('/user', checkSchema(userValidateSchema.getUser), userCtrl.getUser);

/* GET user  map*/
router.get('/user/map', userCtrl.getUserMap);

/* GET user  map*/
router.get('/user/session', userCtrl.getUserSession);

// login
router.post('/login', auth.checkNotLogin, checkSchema(userValidateSchema.login), userCtrl.login);

// register
router.post('/reg', auth.checkNotLogin, checkSchema(userValidateSchema.reg), userCtrl.reg);

// update
router.put('/user', auth.checkLogin, checkSchema(userValidateSchema.update), userCtrl.update);

router.get('/logout', auth.checkLogin, userCtrl.logout);

module.exports = router;
