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

        if (req.body.validUntil) {
            const match = req.body.validUntil.match(/^(\d+)(m|h|d)$/);
            if (match) {
                const now = new Date();
                const value = parseInt(match[1], 10);
                const unit = match[2];

                switch (unit) {
                    case 'm':
                        now.setMinutes(now.getMinutes() + value);
                        break;
                    case 'h':
                        now.setHours(now.getHours() + value);
                        break;
                    case 'd':
                        now.setDate(now.getDate() + value);
                        break;
                    default:
                        throw new Error('Invalid validUntil format');
                }
                newPost.validUntil = now;
            } else {
                throw new Error('Invalid validUntil format');
            }
        }        

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
        let now = new Date();
        if (!req.user) {            
            query.validUntil = { $gte: now };
        } else {
            if (req.query.createdTo) {
                query.createdAt = { $lte: new Date(req.query.createdTo) };
            }
            if (req.query.createdFrom) {
                query.createdAt = { ...query.createdAt, $gte: new Date(req.query.createdFrom) };
            }
            if (req.query.archiveOnly === 'true') {
                query.validUntil = { $lt: now };
            }
            if (req.query.validOnly === 'true') {
                query.validUntil = { $gte: now };
            }
        }


        let posts = await Post.find(query)
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

        if (req.user && req.query.maxInterest === 'true') {
            posts = posts.sort((a, b) => (b.likes + b.dislikes) - (a.likes + a.dislikes))[0];
        }
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
        if (req.body.validUntil) {
            const match = req.body.validUntil.match(/^(\d+)(m|h|d)$/);
            if (match) {
                const now = new Date();
                const value = parseInt(match[1], 10);
                const unit = match[2];

                switch (unit) {
                    case 'm':
                        now.setMinutes(now.getMinutes() + value);
                        break;
                    case 'h':
                        now.setHours(now.getHours() + value);
                        break;
                    case 'd':
                        now.setDate(now.getDate() + value);
                        break;
                    default:
                        throw new Error('Invalid validUntil format');
                }
                req.body.validUntil = now;
            } else {
                throw new Error('Invalid validUntil format');
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
        res.json(updatedPost);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all posts by topic
router.get('/topic/:topic', authNext, async (req, res) => {
    try {
        const topic = req.params.topic;
        let query = { topic: topic };
        const now = new Date();

        if (!req.user) {
            query.validUntil = { $gte: now };
        } else {
            if (req.query.createdTo) {
                query.createdAt = { $lte: new Date(req.query.createdTo) };
            }
            if (req.query.createdFrom) {
                query.createdAt = { ...query.createdAt, $gte: new Date(req.query.createdFrom) };
            }
            if (req.query.archiveOnly === 'true') {
                query.validUntil = { $lt: now };
            }
            if (req.query.validOnly === 'true') {
                query.validUntil = { $gte: now };
            }
        }

        let posts = await Post.find(query)
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

        if (req.user && req.query.maxInterest === 'true') {
            posts = posts.sort((a, b) => (b.likes + b.dislikes) - (a.likes + a.dislikes))[0];
        }

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
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        if (post.author.toString() === req.user._id) {
            return res.status(403).send('Cannot like your own post');
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Dislike a post
router.put('/:id/dislike', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        const now = new Date();
        if (post.validUntil && post.validUntil < now) {
            return res.status(400).send('Post is no longer valid for interactions');
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;