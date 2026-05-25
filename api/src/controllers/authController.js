const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// REGISTER
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            username,
            password: hashed,
        });

        res.status(201).json({
            message: 'User created successfully',
            userId: user._id,
            username: user.username,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // generate JWT token
        const token = generateToken(user._id);

        res.json({
            token,
            userId: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
