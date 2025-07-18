const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
    try {
        const blogpost = await BlogPost.findById(req.params.id);

      
        blogpost.comments.push({
            username: req.body.username || "Anonymous",
            content: req.body.comment,
            createdAt: new Date()
        });

        await blogpost.save();   
        res.redirect(`/post/${req.params.id}`);
    } catch (error) {
        console.error("Error submitting comment:", error);
        res.status(500).send('Error submitting comment');
    }
};