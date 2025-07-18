const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        // Security check: Prevent unauthorized users from deleting posts
        if (!post || post.userid.toString() !== req.session.userId) {
            return res.status(403).send('Unauthorized');
        }

        await BlogPost.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting post');
    }
};