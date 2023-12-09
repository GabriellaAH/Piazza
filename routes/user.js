const express = require('express');
const bcrypt = require('bcryptjs');  
const router = express.Router();
const User = require('../models/user');
const {updateValidation,loginValidation} = require('../validations/validate');
const jsonwebtoken = require('jsonwebtoken');
const {auth} = require('../verifytoken');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { error } = updateValidation(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const user = await User.findOne({ userName: req.body.userName });
        if (user) {
            return res.status(400).send({ message: 'userName already taken' });
        }                
        const { userName, email, password, fullName } = req.body;
        const salt = await bcrypt.genSalt(5)
        let hashedPassword = await bcrypt.hash(password,salt)    
        const newUser = new User({ userName, email, password: hashedPassword, fullName });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// User login
router.post('/login', async (req, res) => {
    // Validate user input
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) {
        return res.status(400).send({ message: 'User does not exist' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send({ message: 'Invalid password' });
    }

    // Generate token
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ 'auth-token': token });
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update user information
router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = updateValidation(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }          
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
