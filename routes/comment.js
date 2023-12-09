const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const {auth} = require('../verifytoken');

// Post a new comment
router.post('/', auth, async (req, res) => {
    try {
        const newComment = new Comment({ ...req.body, author: req.user._id });
        await newComment.save();

        // Find the associated post and add the comment to it
        const post = await Post.findById(req.body.post); 
        if (!post) {
            return res.status(404).send('Post not found');
        }
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get comments for a specific post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId });
        res.json(comments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a comment
router.delete('/:commentId', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        if (comment.author.toString() !== req.user._id) {
            return res.status(401).send('Unauthorized');
        }
        await Post.updateOne(
            { _id: comment.post }, 
            { $pull: { comments: comment._id } }
        );        
        await Comment.deleteOne({ _id: req.params.commentId });
        res.send('Comment deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;
