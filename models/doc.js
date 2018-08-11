const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocSchema = new Schema({
	collectionName: {
		type: String,
		minlength: 2,
		maxlength: 50,
		default: ''
	},
	documentId: {
		type: String,
		minlength: 2,
		maxlength: 50,
		default: ''
	},
	type: {
		type: Number,
		default: 0
	},
	star: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 0
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		default: Date.now
	},
	users: [{
		item: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		star: {
			type: Number,
			default: 0
		},
		role: {
			type: Number,
			default: 0
		},
		status: {
			type: Number,
			default: 0
		}
    }]
});
const Doc = mongoose.model('Doc', DocSchema);
module.exports = Doc;
