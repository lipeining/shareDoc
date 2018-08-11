var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const userCtrl = require('../controllers/user');
const { checkSchema } = require('express-validator/check');
const userValidateSchema = require('./userValidateSchema');
/* GET users listing. */
router.get('/users', auth.checkLogin, checkSchema(userValidateSchema.getUsers), userCtrl.getUsers);

/* GET user  */
router.get('/user', checkSchema(userValidateSchema.getUser), userCtrl.getUser);

/* GET user  map*/
router.get('/user/map', userCtrl.getUserMap);

// login
router.post('/login', auth.checkNotLogin, checkSchema(userValidateSchema.login), userCtrl.login);

// register
router.post('/reg', auth.checkNotLogin, checkSchema(userValidateSchema.reg), userCtrl.reg);

// update
router.put('/user', auth.checkLogin, checkSchema(userValidateSchema.update), userCtrl.update);

router.get('/logout', auth.checkLogin, userCtrl.logout);

module.exports = router;
