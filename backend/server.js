const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./db');
const startCronJobs = require('./cron');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/records', require('./routes/records'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    startCronJobs();
    app.listen(PORT, () => {
        console.log(`Vyapaar Saathi backend running on http://localhost:${PORT}`);
    });
}).catch(err => console.error('DB Sync Error:', err));
