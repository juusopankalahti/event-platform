self.addEventListener("push", async function (e) {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://virtualeventstudio-assets.s3.eu-north-1.amazonaws.com/ves/ves_noti.png",
  });
  const broadcast = new BroadcastChannel("ves-events-messages");
  broadcast.postMessage(data.type);
});
