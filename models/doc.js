const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocSchema = new Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        default: ''
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});
const Doc = mongoose.model('Doc', DocSchema);
module.exports = Doc;