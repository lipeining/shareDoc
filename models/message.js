const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
	type: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 0
	},
    toUser: {
		type: Schema.Types.ObjectId,
		ref: 'User'
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
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
