const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
	type: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 0
    },
    user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
    },
    ref: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    doc: {
        type: Schema.Types.ObjectId,
		ref: 'Doc'
    },
	date: {
		type: Date,
		default: Date.now
	},
});
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
