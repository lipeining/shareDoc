var express = require('express');
var router = express.Router();
const auth = require('../auth/index');
const docCtrl = require('../controllers/doc');
const { checkSchema } = require('express-validator/check');
const docValidateSchema = require('./docValidateSchema');

router.put('/doc/user', auth.checkLogin,
	checkSchema(docValidateSchema.addDocUser), docCtrl.addDocUser);
router.post('/doc', auth.checkLogin,
	checkSchema(docValidateSchema.createDoc), docCtrl.createDoc);
router.get('/docs', auth.checkLogin,
	checkSchema(docValidateSchema.getDocs), docCtrl.getDocs);
router.get('/doc', auth.checkLogin,
	checkSchema(docValidateSchema.getDoc), docCtrl.getDoc);
router.get('/doc/ops', auth.checkLogin,
	checkSchema(docValidateSchema.getDocOps), docCtrl.getDocOps);
router.get('/doc/snapshots', auth.checkLogin,
	checkSchema(docValidateSchema.getSnapshots), docCtrl.getSnapshots);
module.exports = router;
