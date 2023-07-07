import {
  Notification,
  NotificationCallback,
  NotificationCenter,
} from "node-notifier";

export function notify(
  notification?: Notification,
  callback?: NotificationCallback,
) {
  const notifier = new NotificationCenter();
  notifier.notify(notification, callback);
}
