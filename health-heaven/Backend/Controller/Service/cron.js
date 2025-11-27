const cron = require('node-cron');
const { checkAndSendDueReminders } = require('../../Controller/reminderController');
const Reminder = require('../../models/Reminder');

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // Fetch only due reminders
    const dueReminders = await Reminder.find({ date: { $lte: now } }).populate("user");

    if (dueReminders.length === 0) {
      console.log('No due reminders at this time.');
      return;
    }

    console.log(`Processing ${dueReminders.length} due reminders...`);
    
    // Process due reminders
    await checkAndSendDueReminders();
  } catch (error) {
    console.error('Error processing reminders:', error);
  }
});

