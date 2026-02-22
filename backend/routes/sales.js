const express = require('express');
const router = express.Router();
const { Sale } = require('../db');
const auth = require('../middleware/auth');
const Sequelize = require('sequelize');

// Create Sale
router.post('/', auth, async (req, res) => {
    const { amount, date } = req.body;
    if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });

    try {
        const sale = await Sale.create({
            user_id: req.user.id,
            amount,
            date: date || new Date().toISOString().split('T')[0]
        });
        res.json(sale);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Today's Sales Target
router.get('/today', auth, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const sales = await Sale.findAll({
            where: {
                user_id: req.user.id,
                date: today
            }
        });

        const total = sales.reduce((sum, s) => sum + parseFloat(s.amount), 0);
        res.json({ sales, total });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete individual entry
router.delete('/:id', auth, async (req, res) => {
    try {
        const count = await Sale.destroy({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (count === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset entire day
router.delete('/reset/today', auth, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        await Sale.destroy({
            where: {
                user_id: req.user.id,
                date: today
            }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
