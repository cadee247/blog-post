const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    username: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);