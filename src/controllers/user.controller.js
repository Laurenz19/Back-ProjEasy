const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../utils/database');
const { generateAccessToken, generateRefreshToken } = require('../middleware/authentication');

/**
 * Register function
 */
exports.register = async (req, res) => {
    const USER_MODEL = {
        lastname: req.body.lastname,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };

    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            return res.status(400).json({ message: "The email you entered is already registered." });
        }

        const newUser = await User.create(USER_MODEL);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json(error.errors.map(err => ({ message: err.message })));
    }
};

/**
 * Update an existing user
 */
exports.updateUser = async (req, res) => {
    const USER_MODEL = {
        lastname: req.body.lastname,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };

    try {
        if (req.body.password) {
            USER_MODEL.password = await bcrypt.hash(req.body.password, 10);
        }

        await User.update(USER_MODEL, { where: { id: req.params.id }, individualHooks: true });
        const updatedUser = await User.findByPk(req.params.id);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id }, individualHooks: true });
        res.status(200).json({ message: "User successfully deleted." });
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Login function
 */
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        const { password, createdAt, updatedAt, ...USER_MODEL } = user.toJSON();

        USER_MODEL.initial = (user.name[0] + user.lastname[0]).toUpperCase();

        const accessToken = generateAccessToken(USER_MODEL);

        res.status(200).json({
            accessToken,
            user: USER_MODEL
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

/**
 * Logout function
 */
exports.logout = async (req, res) => {
    // Assuming you're handling JWTs on the client side
    res.status(200).json({ message: 'User logged out' });
};

/**
 * Get User function
 */
exports.getUser = async (req, res) => {
    try {
        const _user = await User.findByPk(req.params.id);
        if (!_user) return res.status(404).json({ message: "User not found" });

        const user = {
            id: _user.id,
            lastname: _user.lastname,
            name: _user.name,
            email: _user.email,
            role: _user.role
        };

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Get all users from the database
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Refresh token function
 */
exports.refreshToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(400);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const refreshToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
        res.send({
            accessToken: refreshToken
        });
    });
};
