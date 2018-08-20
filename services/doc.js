var db = require('../sharedocdb');
const shareDBServer = require('../shareDBServer')
	.shareDBServer;
const Doc = require('../models/doc');
const User = require('../models/user');
const userService = require('./user');
module.exports = {
	createDoc,
	createDocData,
	importDoc,
	addDocUser,
	getMyDocNames,
	getDocById,
	getDocTest,
	getDocOps,
	getSnapshots
};

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {String} options.collectionName
 * @param {String} options.documentId
 * @returns
 */
async function createDoc(user, options) {
	let item = await Doc.create(options);
	console.log(item);
	let doc = {
		item: item,
		star: 1
	};
	let userInstance = await userService.getUserById({
		id: user._id
	});
	await userInstance.docs.push(doc);
	await userInstance.save();
	return await item;
}

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {*} delta
 * @param {String} options.collectionName
 * @param {String} options.documentId
 * @returns
 */
async function createDocData(options, delta = []) {
	// 只有在需要的时候，连接服务器.
	let shareConnection = shareDBServer.connect();
	let storeDoc = shareConnection.get(options.collectionName, options.documentId);
	storeDoc.create(delta, 'rich-text');
	// if (!storeDoc.type)
	// 	storeDoc.create([], 'rich-text');
}

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {String} options.collectionName
 * @param {String} options.documentId
 * @param {Object} options.delta
 * @returns
 */
async function importDoc(user, options) {
	// 只有在需要的时候，连接服务器.
	let shareConnection = shareDBServer.connect();
	let storeDoc = shareConnection.get(options.collectionName, options.documentId);
	storeDoc.create([], 'rich-text', function(err) {
		if(err) {
			console.log('import doc create doc error');
			console.log(err);
		} else {
			// storeDoc.subscribe(function(error) {
			// 	if(error) {
			// 		console.log('import doc subscribe doc error');
			// 		console.log(error);
			// 	} else {
			// 		storeDoc.submitOp(options.delta, {source: 'wow'});
			// 	}
			// });
			storeDoc.submitOp(options.delta, {source: 'wow'});
		}
	});
}

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {String} options.userId
 * @param {String} options.docId
 * @returns
 */
async function addDocUser(user, options) {
	// check user permission
	let userInstance = await userService.getUserById({
		id: options.userId
	});
	let docInstance = await getDocById({
		id: options.docId
	});
	let star = 1;
	let role = 1;
	let itemDoc = {
		item: docInstance,
		star: star,
		role: role
	};
	let itemUser = {
		item: userInstance,
		star: star,
		role: role
	};
	await userInstance.docs.push(itemDoc);
	await userInstance.save();
	await docInstance.users.push(itemUser);
	await docInstance.save();
	return await {};
}

/**
 *
 *
 * @param {*} options
 * @param {*} options.docId
 * @returns
 */
async function getDocById(options) {
	// 可以获取对应的doc
	// check permission?
	return await Doc.findById(options.id)
		.populate({
			path: 'users.item'
		});
}

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {Int} options.id
 * @returns
 */
async function getDocTest(user, options) {
	// 可以获取对应的docs列表
	let doc1 = await Doc.findById(options.id)
		.populate('users.item');
	// console.log(doc1.creator);
	// console.log(doc1.users[0].item);// 这是一个对象
	// console.log(user._id);
	let doc2 = await Doc.findById(options.id)
		.populate({
			path: 'users.item',
			populate: {
				path: 'docs.item'
			}
		});
	// console.log(doc2.creator);
	// console.log(doc2.users[0].item._id);
	// console.log(user._id);
	let doc3 = await Doc.findById(options.id)
		.populate({
			path: 'users.item',
			model: User,
			populate: {
				path: 'docs.item',
				model: Doc
			}
		});
	return {
		doc1,
		doc2,
		doc3
	};
}

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @returns
 */
async function getMyDocNames(user, options) {
	let docs = await Doc.find({ creator: user._id })
		.select({ documentId: 1, collection: 1 });
	return await docs;
}

/**
 *
 *
 * @param {*} options
 * @param {String} options.collectionName
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
	// http://bluebirdjs.com/docs/api/new-promise.html
	let from = 1;
	let to = snapshots.v;
	return new Promise(function(resolve, reject) {
		db.getOps(options.collectionName, options.documentId, from, to, {},
			function(err, ops) {
				if (err) {
					reject(err);
				} else {
					resolve({
						ops: ops,
						total: maxV
					});
				}
			});
	});
}

/**
 *
 * @param {String} options.collectionName
 * @param {String} options.documentId
 * @param {Int} options.getOps // 是否返回ops数组
 * @returns
 */
async function getSnapshots(options) {
	// 可以获取对应的snapshots
	return new Promise(function(resolve, reject) {
		db.getSnapshot(options.collectionName, options.documentId, {
				ops: options.getOps ? 1 : 0
			}, {
				metadata: 1
			},
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
 * @param {String} options.collectionName 
 * @returns {Promise}
 */
async function getCollection(options) {
	// 可以获取对应的snapshots
	return new Promise(function(resolve, reject) {
		db.getCollection(options.collectionName,
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
//   db.query(collectionName, query, {}, {}, function (err, snapshots, extra) {
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
