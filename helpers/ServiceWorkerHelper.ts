const publicVapidKey = process.env.PUBLIC_VAPID_KEY;

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  return permission;
};

export async function registerServiceWorker(
  onMessage: (event: MessageEvent<any>) => void
) {
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });
  const permission = await requestNotificationPermission();
  if (register.pushManager && permission == "granted") {
    const pushSubscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });
    const broadcast = new BroadcastChannel("ves-events-messages");
    broadcast.onmessage = onMessage;
    return pushSubscription;
  }
}
