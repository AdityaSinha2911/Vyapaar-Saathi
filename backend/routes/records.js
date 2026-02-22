const express = require('express');
const router = express.Router();
const { Record } = require('../db');
const auth = require('../middleware/auth');

// Create Record
router.post('/', auth, async (req, res) => {
    const { category, title, amount, notes } = req.body;

    if (!category || !title) {
        return res.status(400).json({ error: 'Category and title are required' });
    }

    try {
        const record = await Record.create({
            user_id: req.user.id,
            category,
            title,
            amount,
            notes
        });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Records
router.get('/', auth, async (req, res) => {
    const { category } = req.query; // optional filter
    try {
        let where = { user_id: req.user.id };
        if (category) where.category = category;

        const records = await Record.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Record
router.delete('/:id', auth, async (req, res) => {
    try {
        const count = await Record.destroy({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (count === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
