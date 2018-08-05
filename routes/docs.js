var express = require('express');
var router = express.Router();
var db = require('../sharedocdb');
var util = require('util');
const APIError = require('../tools/APIError');
router.get('/doc/content', function (req, res, next) {
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
module.exports = router;