const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../db');
const auth = require('../middleware/auth');

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// Mock OTP Login
router.post('/login', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    let user = await User.findOne({ where: { phone } });
    let isNew = false;

    if (!user) {
        user = await User.create({ phone });
        isNew = true;
    }

    const token = generateToken(user);
    res.json({ token, isNew, user });
});

// Update Profile (Onboarding)
router.put('/profile', auth, async (req, res) => {
    const { name, age, business_type, language, location } = req.body;

    if (age < 18) return res.status(400).json({ error: 'Must be 18+' });

    try {
        await User.update(
            { name, age, business_type, language, location },
            { where: { id: req.user.id } }
        );
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (ex) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
