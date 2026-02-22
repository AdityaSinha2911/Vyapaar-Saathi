const express = require('express');
const router = express.Router();
const { Task } = require('../db');
const auth = require('../middleware/auth');

// Create Task
router.post('/', auth, async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const task = await Task.create({
            user_id: req.user.id,
            title,
            status: 'active'
        });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all Tasks
router.get('/', auth, async (req, res) => {
    const { status } = req.query; // optional filter
    try {
        let where = { user_id: req.user.id };
        if (status) where.status = status;

        const tasks = await Task.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Task Status
router.put('/:id/status', auth, async (req, res) => {
    const { status } = req.body;
    if (!['active', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const updateData = { status };
        if (status === 'completed') {
            updateData.completed_at = new Date();
        } else {
            updateData.completed_at = null;
        }

        const [updated] = await Task.update(updateData, {
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (updated === 0) return res.status(404).json({ error: 'Task not found' });

        const task = await Task.findOne({ where: { id: req.params.id } });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        const count = await Task.destroy({
            where: { id: req.params.id, user_id: req.user.id }
        });
        if (count === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
