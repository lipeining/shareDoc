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
 * @returns
 */
async function upload64(baseStr) {
	let arr = baseStr.match(/data:image\/(\S*);base64/);
	if (!arr) {
		// return null if match not found 
		throw new APIError('not a image base64 str', 400);
	} else {
		let type = arr[1];
		// 去除开头的数据,即"base64," 这段数据
		let str = baseStr.slice(19 + type.length);
		let fileName = await createImage(str, type);
		console.log(fileName);
		return path.join('/images/', fileName);
	}
}

/**
 *
 *
 * @param {String} str
 * @param {String} type
 * @returns
 */
async function createImage(str, type) {
	return await new Promise(function(accept, reject) {
		let fileName = Date.now() + 'wow' + '.' + type;
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
