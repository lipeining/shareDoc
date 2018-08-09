 var express = require('express');
 var router = express.Router();
 const {checkSchema, validationResult} = require('express-validator/check');
 /* GET home page. */
 router.get('/', checkSchema({ id: { in: ['query'], isInt: true, toInt: true } }),
 	function(req, res, next) {
		validationResult(req).throw();
 		return next({
 			msg: {
 				index: 'index',
 				id: req.query.id
 			}
 		});
 	});

 module.exports = router;
