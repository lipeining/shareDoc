var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const userCtrl = require('../controllers/user');



/* GET users listing. */
router.get('/users', auth.checkLogin, userCtrl.getUsers);

/* GET user  */
router.get('/user', auth.checkLogin, userCtrl.getUser);

// login
router.post('/login', auth.checkNotLogin, userCtrl.login);

// register
router.post('/reg', auth.checkNotLogin, userCtrl.reg);

// update
router.put('/user', auth.checkLogin, userCtrl.update);

router.get('/logout', auth.checkLogin, userCtrl.logout);


module.exports = router;