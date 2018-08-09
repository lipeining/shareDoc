var db = require('../sharedocdb');

module.exports = {
	getDocOps,
	getSnapshots
};

/**
//  *
 *
 * @param {*} options
 * @param {String} options.collection
 * @param {String} options.documentId
 * @param {Int} options.from
 * @param {Int} options.to
 * @returns
 */
async function getDocOps(options) {
	// 可以获取对应的ops列表
	let snapshots = await getSnapshots(options);
	let maxV = snapshots.v - 1;
	// 暂时不管有多长，全部返回
	// let to = options.to > maxV ? maxV : options.to;
	// let from = options.from;
	let from = 1;
	let to = snapshots.v;
	return new Promise(function(resolve, reject) {
		db.getOps(options.collection, options.documentId, from, to, {},
			function(err, ops) {
				if (err) {
					reject(err);
				} else {
					resolve({ ops: ops, total: maxV });
				}
			});
	});
}

/**
 *
 * @param {String} options.collection
 * @param {String} options.documentId
 * @param {Int} options.getOps // 是否返回ops数组
 * @returns
 */
async function getSnapshots(options) {
	// 可以获取对应的snapshots
	return new Promise(function(resolve, reject) {
		db.getSnapshot(options.collection, options.documentId, { ops: options.getOps ? 1 : 0 }, { metadata: 1 },
			function(err, snapshots) {
				if (err) {
					reject(err);
				} else {
					resolve(snapshots);
				}
			});
	});
}

/**
 *
 * @param {String} options.collection 
 * @returns {Promise}
 */
async function getCollection(options) {
	// 可以获取对应的snapshots
	return new Promise(function(resolve, reject) {
		db.getCollection(options.collection,
			function(err, collection) {
				if (err) {
					reject(err);
				} else {
					resolve(collection);
				}
			});
	});
}

// let query = {
//     "_id": documentId,
// };
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
