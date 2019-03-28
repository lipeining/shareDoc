var db = require('../sharedocdb');
const mongoose = require('mongoose');
const shareDBServer = require('../shareDBServer')
	.shareDBServer;
const Doc = require('../models/doc');
const User = require('../models/user');
const userService = require('./user');
module.exports = {
	createDoc,
	createDocData,
	importDoc,
	getDocUsers,
	setDocUser,
	addDocUser,
	updateDocUser,
	removeDocUser,
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
	let doc = await Doc.create(options);
	console.log(doc);
	let docitem = {
		item: doc,
		role: 0
	};
	let userInstance = await userService.getUserById({
		id: user._id
	});
	await userInstance.docs.push(docitem);
	await userInstance.save();
	return await doc;
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
		if (err) {
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
			storeDoc.submitOp(options.delta, { source: 'wow' });
		}
	});
}

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {String} options.id
 * @returns
 */
async function getDocUsers(user, options) {
	let doc = await getDocById(options.docId);
	let users = doc.users;
	if(options.type) {
		// 查找不在该文档中的人
	} else {
		// 插在在该文档中的人
		//  do nothing
	}
	return users;
}	

/**
 *
 *
 * @param {*} user
 * @param {*} options
 * @param {String} options.userId
 * @param {String} options.docId
 * @param {Int} options.status
 * @returns
 */
async function setDocUser(user, options) {
	// check user permission
	let content = '';
	if (options.status === 2) {
		// 移除
		content = await removeDocUser(user, options);
	} else {
		// 设置
		content = await updateDocUser(user, options);
	}
	return await content;
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
	// return await run();
	// check user permission
	let star = 0;
	let role = 1;
	let itemDoc = {
		item: options.docId,
		status: options.status,
		star: star,
		role: role
	};
	let itemUser = {
		item: options.userId,
		status: options.status,
		star: star,
		role: role
	};
	await User.findOneAndUpdate({
		_id: options.userId,
		'docs.item': { $ne: options.docId }
	}, {
		$push: {
			'docs': itemDoc
		}
	});
	let docInstance = await Doc.findOneAndUpdate({
		_id: options.docId,
		'users.item': { $ne: options.userId }
	}, {
		$push: {
			'users': itemUser
		}
	});
	if (docInstance) {
		let permission = options.status ? '只读' : '读写';
		return await `${user.name} invite you to doc ${docInstance.collectionName}-${docInstance.documentId},${permission}`;
	} else {
		// 没有新增添对应的关系
		return Promise.reject('can not add doc user');
	}
	// check是否已经有该对象, addToSet不能确认是否已经有该对象了，需要使用update和ne.
	// await userInstance.docs.addToSet(itemDoc);
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
async function updateDocUser(user, options) {
	// let docInstance = await getDocById({
	// 	id: options.docId
	// });
	// let userup = await User.updateOne({"_id": options.userId}, {
	// 	$set: {
	// 		"docs.$[elem].status": options.status,
	// 		"docs.$[elem].item": options.docId
	// 		// "docs.$[].status": options.status,
	// 		// "docs.$[].item": options.docId
	// 	}
	// }, {
	// 	// arrayFilters: [{$and: [{ "elem.status": antiStatus }, { "elem.item": options.docId }]}],
	// 	arrayFilters: [{ "elem.item": mongoose.Types.ObjectId(options.docId) }],
	// 	setDefaultOnInsert: true,
	// 	upsert: true
	// });
	// let docup = await Doc.updateOne({"_id": options.docId}, {
	// 	$set: {
	// 		"users.$[elem].status": options.status,
	// 		"users.$[elem].item": options.userId
	// 	}
	// }, {
	// 	// arrayFilters: [{$and: [{ "elem.status": antiStatus }, { "elem.item": options.docId }]}],
	// 	arrayFilters: [{ "elem.item": mongoose.Types.ObjectId(options.userId) }],
	// 	setDefaultOnInsert: true,
	// 	upsert: true
	// });
	// console.log(userup);
	// console.log(docup);
	// let permission = options.status ? '只读' : '读写';
	// return await `${user.name} invite you to doc ${docInstance.collectionName}-${docInstance.documentId},${permission}`;

	// // https://docs.mongodb.com/manual/reference/operator/update/positional-filtered/
	// let antiStatus = options.status ? 0 : 1; // 取反的status
	let userUp = await User.findOneAndUpdate({
		_id: options.userId
	}, {
		"$set": {
			"docs.$[elem].status": options.status,
			"docs.$[elem].item": options.docId
		}
	}, {
		// arrayFilters: [{$and: [{ "elem.status": antiStatus }, { "elem.item": options.docId }]}],
		arrayFilters: [{ "elem.item": mongoose.Types.ObjectId(options.docId) }],
		// setDefaultOnInsert: true,
		// upsert: true
	});
	let docUp = await Doc.findOneAndUpdate({
		_id: options.docId
	}, {
		"$set": {
			"users.$[elem].status": options.status,
			"users.$[elem].item": options.userId
		}
	}, {
		// arrayFilters: [{$and: [{ "elem.status": antiStatus }, { "elem.item": options.userId }]}],
		arrayFilters: [{ "elem.item": mongoose.Types.ObjectId(options.userId) }],
		// setDefaultOnInsert: true,
		// upsert: true
	});
	// 如果只是更新的话，不会使用默认值
	// 仅用作更新，不能upsert。
	// console.log(useradd, docadd);
	if (docUp) {
		let permission = options.status ? '只读' : '读写';
		// console.log(docUp);
		// console.log(userUp);
		return await `${user.name} invite you to doc ${docUp.collectionName}-${docUp.documentId},${permission}`;
	} else {
		return Promise.reject('can not set doc user');
	}

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
async function removeDocUser(user, options) {
	// check user permission
	let userInstance = await User.findByIdAndUpdate(options.userId, {
		$pull: {
			docs: {
				item: options.docId
			}
		}
	});
	let docInstance = await Doc.findByIdAndUpdate(options.docId, {
		$pull: {
			users: {
				item: options.userId
			}
		}
	});
	// console.log(userInstance);
	// console.log(docInstance);
	if(docInstance) {
		return await `${user.name} remove you from doc ${docInstance.collectionName}-${docInstance.documentId}`;
	} else {
		return Promise.reject('can not remove doc user');
	}
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
		.select({ documentId: 1, collectionName: 1 });
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
