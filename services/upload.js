const APIError = require('../tools/APIError');
const fs = require('fs');
const path = require('path');
module.exports = {
	upload64
}

/**
 *
 *
 * @param {String} baseStr
 * @param {String} name
 * @returns
 */
async function upload64(baseStr, name) {
	let arr = baseStr.match(/data:image\/(\S*);base64/);
	if (!arr) {
		// return null if match not found 
		throw new APIError('not a image base64 str', 400);
	} else {
		let type = arr[1];
		// 去除开头的数据,即"base64," 这段数据
		let str = baseStr.slice(19 + type.length);
		let fileName = await createImage(name, str, type);
		console.log(fileName);
		return path.join('/images/', fileName);
	}
}

/**
 *
 *
 * @param {String} name
 * @param {String} str
 * @param {String} type
 * @returns
 */
async function createImage(name, str, type) {
	return await new Promise(function(accept, reject) {
		let fileName = Date.now() + name + '.' + type;
		let filePath = path.resolve(__dirname, '../public/images/', fileName);
		console.log(filePath);
		fs.writeFile(filePath, str, 'base64', function(err) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				accept(fileName);
			}
		})
	});
}
