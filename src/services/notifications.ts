import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types';
import { getRandomQuote } from '../constants/motivationalQuotes';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private initialized = false;

  async init(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('deadlines', {
          name: 'Task Deadlines',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  async scheduleTaskNotifications(task: Task, language: string = 'en'): Promise<string[]> {
    if (!task.deadline || !task.notificationMinutes || task.notificationMinutes.length === 0) {
      console.log('No deadline or notifications to schedule');
      return [];
    }

    const initialized = await this.init();
    if (!initialized) {
      console.log('Notifications not initialized');
      return [];
    }

    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const notificationIds: string[] = [];

    console.log(`Scheduling notifications for task: ${task.taskName}`);
    console.log(`Deadline: ${deadlineDate.toISOString()}`);
    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Notification minutes: ${task.notificationMinutes.join(', ')}`);

    // Cancel any existing notifications for this task
    await this.cancelTaskNotifications(task.id);

    for (const minutesBefore of task.notificationMinutes) {
      const triggerTime = deadlineDate.getTime() - (minutesBefore * 60 * 1000);
      const nowTime = Date.now();
      const secondsUntilTrigger = Math.floor((triggerTime - nowTime) / 1000);

      console.log(`\n--- Notification ${minutesBefore} min before ---`);
      console.log(`Trigger time: ${new Date(triggerTime).toISOString()}`);
      console.log(`Seconds until trigger: ${secondsUntilTrigger}`);

      // Skip if trigger time is in the past or too soon (less than 5 seconds)
      if (secondsUntilTrigger < 5) {
        console.log(`SKIPPING: Too soon or in the past (${secondsUntilTrigger}s)`);
        continue;
      }

      try {
        const quote = getRandomQuote(language as any, 'encouragement');
        const timeUntilDeadline = this.formatTimeUntil(minutesBefore);

        // Use DateTriggerInput with timestamp
        const trigger: any = {
          type: 'date',
          date: triggerTime,
        };

        // Add channel for Android
        if (Platform.OS === 'android') {
          trigger.channelId = 'deadlines';
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: task.taskName,
            body: `${timeUntilDeadline}\n\n${quote.text}`,
            data: { taskId: task.id, type: 'deadline', minutesBefore },
            sound: true,
          },
          trigger,
        });

        notificationIds.push(notificationId);
        console.log(`SUCCESS: Scheduled with ID ${notificationId}`);
      } catch (error) {
        console.error(`FAILED to schedule:`, error);
      }
    }

    console.log(`\nTotal scheduled: ${notificationIds.length} notifications`);
    return notificationIds;
  }

  async cancelTaskNotifications(taskId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

      for (const notification of scheduledNotifications) {
        if (notification.content.data?.taskId === taskId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  private formatTimeUntil(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes until deadline`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} until deadline`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} until deadline`;
    }
  }

  // Get all scheduled notifications (for debugging)
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
export default notificationService;
