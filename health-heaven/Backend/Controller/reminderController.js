const Reminder = require("../models/Reminder");
const User = require("../models/Newuser");
const moment = require("moment");
const sendEmail = require("../utils/sendEmail");
const reminderTemplate = require("../utils/reminderTemplate");

const createReminder = async (req, res) => {
  const { date, time, recurrence, notifications, message, userId } = req.body;

  try {
    if (!date || !time || !message || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate date and time format
    if (!moment(date).isValid() || !moment(time, "HH:mm", true).isValid()) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const reminderDate = moment(date).set({
      hour: moment(time, "HH:mm").hour(),
      minute: moment(time, "HH:mm").minute(),
      second: 0,
      millisecond: 0,
    });

    const reminder = new Reminder({
      date: reminderDate.toDate(),
      time,
      recurrence,
      notifications,
      message,
      user: userId,
      sent: false, // Initialize sent as false
    });

    await reminder.save();

    res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ message: "Failed to create reminder", error: error.message });
  }
};

// Send reminder notifications
const sendReminderNotifications = async (reminder) => {
  try {
    if (reminder.notifications?.email && reminder.user?.email && !reminder.sent) { // Check if not sent
      const emailContent = reminderTemplate(reminder.user.name, reminder.message);

      await sendEmail({
        to: reminder.user.email,
        subject: "Medication Reminder",
        text: reminder.message,
        htmlContent: emailContent,
      });

      // Mark reminder as sent
      reminder.sent = true;
      await reminder.save(); // Save the updated reminder
    }
  } catch (error) {
    console.error("Error sending reminder notification:", error);
  }
};

// Check and send due reminders
const checkAndSendDueReminders = async () => {
  try {
    const now = moment();

    // Find reminders that are due
    const reminders = await Reminder.find({
      date: { $lte: now.toDate() },
      sent: false, // Only fetch reminders that haven't been sent yet
    }).populate("user");

    for (const reminder of reminders) {
      // Send notification
      await sendReminderNotifications(reminder);

      // Update the recurrence and date based on reminder's recurrence type
      if (reminder.recurrence === "Daily") {
        reminder.date = moment(reminder.date).add(1, "days").toDate();
      } else if (reminder.recurrence === "Weekly") {
        reminder.date = moment(reminder.date).add(1, "weeks").toDate();
      } else if (reminder.recurrence === "Monthly") {
        reminder.date = moment(reminder.date).add(1, "months").toDate();
      } else if (reminder.recurrence === "Custom" && reminder.customDays) {
        reminder.date = moment(reminder.date).add(reminder.customDays, "days").toDate();
      }

      await reminder.save(); // Save updated reminder date and other info
    }
  } catch (error) {
    console.error("Error checking reminders:", error);
  }
};

module.exports = {
  createReminder,
  checkAndSendDueReminders,
};
