var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const searchCtrl = require('../controllers/search');
const { checkSchema } = require('express-validator/check');
const searchValidateSchema = require('./searchValidateSchema');

router.get('/search/doc/history',
	checkSchema(searchValidateSchema.getDocHistory), searchCtrl.getDocHistory);
router.get('/search/pingserver', searchCtrl.pingServer);

module.exports = router;
