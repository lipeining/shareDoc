var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const docCtrl = require('../controllers/doc');
const { checkSchema } = require('express-validator/check');
const docValidateSchema = require('./docValidateSchema');

router.get('/doc/ops', auth.checkLogin,
	checkSchema(docValidateSchema.getDocOps), docCtrl.getDocOps);
router.get('/doc/snapshots', auth.checkLogin,
	checkSchema(docValidateSchema.getSnapshots), docCtrl.getSnapshots);
module.exports = router;
