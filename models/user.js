const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
	name: {
		type: String,
		minlength: 2,
		maxlength: 50,
		default: ''
	},
	email: {
		type: String,
		default: '',
		validate: {
			validator: function(v) {
				var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				return emailRegex.test(v);
			},
			message: '{VALUE} is not a valid email!'
		},
	},
	password: {
		type: String,
		minlength: 64,
		maxlength: 256,
		default: ''
	},
	avatar: {
		type: String,
		default: ''
	},
	intro: {
		type: String,
		default: ''
	},
	permission: {
		type: Number,
		default: 0
	},
	date: {
		type: Date,
		default: Date.now
	},
	docs: [{
		type: Schema.Types.ObjectId,
		ref: 'Doc'
    }]
});
UserSchema.path('name')
	.required(true, 'user name is requried');
UserSchema.path('email')
	.required(true, 'user email is requried');
UserSchema.path('password')
	.required(true, 'user password is requried');
const User = mongoose.model('User', UserSchema);
module.exports = User;
