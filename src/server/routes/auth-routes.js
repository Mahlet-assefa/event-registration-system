const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { getUsers, saveUser } = require('../database-service');
const { JWT_SECRET } = require('../middleware/auth-middleware');

const router = express.Router();
console.log('Auth Routes Loaded');

router.post('/register', async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const users = await getUsers();
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            isAdmin: !!isAdmin
        };

        await saveUser(newUser);

        // Generate Token
        const token = jwt.sign({ id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', user: { ...newUser, password: undefined }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user;

        // Generate Token
        const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ user: userWithoutPassword, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
