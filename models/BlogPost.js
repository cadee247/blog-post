const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    title: String,
    body: String,
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datePosted: {
        type: Date,
        default: new Date()
    },
    image: String,
    comments: [{  
        username: String,  //  Stores username inside the post
        content: String,   //  Stores actual comment text
        createdAt: { type: Date, default: Date.now }  //  Automatically timestamps the comment
    }]
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost;