const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const {auth, authNext} = require('../verifytoken');
const User = require('../models/user');
const Comment = require('../models/comment');

// Create a new post
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new Post({ ...req.body, author: req.user._id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all posts
router.get('/', authNext, async (req, res) => {
    try {
        let query = {};

        
        if (req.user) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            query.updatedAt = { $gte: thirtyDaysAgo };
        }

        const posts = await Post.find(query)
                                .populate('author', 'fullName')
                                .populate({
                                    path: 'comments',
                                    select: 'content createdAt', 
                                    populate: {
                                        path: 'author',
                                        model: 'User',
                                        select: 'fullName'
                                    }
                                });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
                               .populate('author', 'fullName')
                               .populate({
                                   path: 'comments',
                                   select: 'content createdAt', 
                                   populate: {
                                       path: 'author',
                                       model: 'User',
                                       select: 'fullName'
                                   }
                               });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(await Post.findById(req.params.id)
        .populate('author', 'fullName')
        .populate({
            path: 'comments',
            select: 'content createdAt', 
            populate: {
                path: 'author',
                model: 'User',
                select: 'fullName'
            }
        }));
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all posts by topic
router.get('/topic/:topic', authNext, async (req, res) => {
    try {
        const topic = req.params.topic;
        let query = { topic: topic };

        
        if (req.user) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            query.updatedAt = { $gte: thirtyDaysAgo };
        }

        const posts = await Post.find(query)
                                .populate('author', 'fullName')
                                .populate({
                                    path: 'comments',
                                    select: 'content createdAt',
                                    populate: {
                                        path: 'author',
                                        model: 'User',
                                        select: 'fullName'
                                    }
                                });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const postId = req.params.id;
        await Comment.deleteMany({ post: postId });
        await Post.findByIdAndDelete(postId);
        res.send('Post deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Like a post
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Dislike a post
router.put('/:id/dislike', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;