const cron = require('node-cron');
const { User, Sale, Task } = require('./db');

const startCronJobs = () => {
    // Run every day at 8:00 PM (20:00)
    cron.schedule('0 20 * * *', async () => {
        console.log('Running 8 PM Reminders Cron Job...');
        try {
            const today = new Date().toISOString().split('T')[0];
            const users = await User.findAll();

            for (const user of users) {
                // Check sales
                const salesToday = await Sale.count({
                    where: { user_id: user.id, date: today }
                });

                // Check tasks
                const pendingTasks = await Task.count({
                    where: { user_id: user.id, status: 'active' }
                });

                if (salesToday === 0 || pendingTasks > 0) {
                    // Identify that user needs a reminder
                    // In a real WebPush context, we'd trigger a push service here.
                    // For MVP, we will store a flag on the user or they can just poll an endpoint that checks this live.
                    // To keep it simple, we log it. The frontend will have an endpoint to check their live reminder status.
                    console.log(`User ${user.name} needs a reminder. Sales: ${salesToday}, Pending Tasks: ${pendingTasks}`);
                }
            }
        } catch (err) {
            console.error('Cron job error:', err);
        }
    });
};

module.exports = startCronJobs;
