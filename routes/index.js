 var express = require('express');
 var router = express.Router();
 const constants = require('../constants');
 var db = require('../db');
 var util = require('util');
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
 router.get('/login', function (req, res, next) {
   let i = parseInt(req.query.id) || 1;
   req.session.user = constants.Users[i - 1];
   req.session.save();
   return res.json({
     code: 0,
     Message: {
       user: req.session.user
     }
   });
 });
 router.get('/test', function (req, res, next) {
     //  // 查询collection的实例
  //  db.getDbs(function (err, d) {
  //    if (err) {
  //      console.log(err);
  //    } else {
  //      console.log('dbs');
  //      console.log(d);
  //      return res.json({
  //        code: 0,
  //        Message: {
  //          msg: d
  //        }
  //      });
  //    }
  //  });
  //  // 查询collection的实例
  //  db.getCollection(collection, function (err, c) {
  //    if (err) {
  //      console.log(err);
  //    } else {
  //      console.log('collection');
  //      console.log(collection);
  //      return res.json({
  //        code: 0,
  //        Message: {
  //          msg: collection
  //        }
  //      });
  //    }
  //  });
   return res.json({
     code: 0,
     Message: req.session.user
   });
 });
 router.get('/doccontent', function (req, res, next) {
   let collection = req.query.collection || '';
   let documentId = req.query.documentId || '';
   console.log(collection, documentId);
   // 查看sharedb-mongo 681函数定义
   let query = {
     "_id": documentId,
   };
  //  console.log(db);
  //  console.log(db.query);

   // 可以获取对应的ops列表
   db.getOps(collection, documentId, 0, 10, {}, function (err, ops) {
     if (err) {
       console.log(err);
       return res.json({
         code: 4,
         Message: {
           e: err
         }
       });
     } else {
       console.log('ops');
       console.log(ops);
       return res.json({
         code: 0,
         Message: {
           msg: ops
         }
       });
     }
   });
  //  // 查询文档的内容
  //   db.query(collection, query, {}, {}, function (err, snapshots, extra) {
  //     if (err) {
  //       console.log(err);
  //       return res.json({
  //         code: 4,
  //         Message: {
  //           e: err
  //         }
  //       });
  //     } else {
  //       console.log('snapshots');
  //       console.log(util.inspect(snapshots));
  //       console.log('extra');
  //       console.log(extra);
  //       return res.json({
  //         code: 0,
  //         Message: {
  //           msg: snapshots
  //         }
  //       });
  //     }
  //   });
 });

 router.get('/logout', (request, response) => {
   console.log('Destroying session');
   request.session.destroy();
   response.send({
     code: 0,
     Message: 'Session destroyed'
   });
 });

 module.exports = router;