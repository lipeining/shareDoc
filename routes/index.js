 var express = require('express');
 var router = express.Router();
 
 /* GET home page. */
 router.get('/', function (req, res, next) {
   // res.render('index', {
   //   title: 'Express'
   // });
   return res.json({
     code: 0,
     Message: {
       index: 'index'
     }
   })
 });

 module.exports = router;