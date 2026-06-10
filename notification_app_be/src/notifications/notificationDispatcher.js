// src/notifications/notificationDispatcher.js
// Simulates dispatching notifications via email / sms / push channels

/**
 * Dispatch a notification to the appropriate channel.
 * In production, replace the simulation with real providers:
 *   - Email: Nodemailer / SendGrid
 *   - SMS: Twilio / AWS SNS
 *   - Push: Firebase FCM
 *
 * @param {Object} notification - The notification record
 * @returns {Promise<{ success: boolean, response: string }>}
 */
async function dispatch(notification) {
  return new Promise((resolve) => {
    // Simulate async network call
    setTimeout(() => {
      console.log(`[Dispatcher] 📤 Sending ${notification.type.toUpperCase()} to ${notification.recipient}`);
      console.log(`[Dispatcher]    Message: ${notification.message}`);

      // Simulate 95% success rate
      const success = Math.random() > 0.05;

      if (success) {
        console.log(`[Dispatcher] ✅ ${notification.type.toUpperCase()} delivered successfully.`);
        resolve({ success: true, response: `${notification.type} delivered to ${notification.recipient}` });
      } else {
        console.warn(`[Dispatcher] ❌ ${notification.type.toUpperCase()} delivery failed.`);
        resolve({ success: false, response: `Failed to deliver ${notification.type} to ${notification.recipient}` });
      }
    }, 200);
  });
}

module.exports = { dispatch };
