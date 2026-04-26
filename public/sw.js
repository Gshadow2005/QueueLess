/**
 * QueueLess Service Worker
 * Handles Web Push notifications so alerts work on mobile
 * even when the browser is backgrounded or the screen is off.
 *
 * Backend payload shape (from notifications/utils.py):
 * {
 *   "title": "QueueLess",
 *   "body": "Queue #05: please prepare, 2 ahead of you.",
 *   "event_type": "near_turn" | "turn_called" | "session_expired" | "session_completed" | "generic",
 *   "session_id": "uuid-string"
 * }
 */

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: "QueueLess",
      body: event.data.text(),
      event_type: "generic",
      session_id: null,
    };
  }

  const title = payload.title ?? "QueueLess";
  const body = payload.body ?? "You have a queue update.";
  const event_type = payload.event_type ?? "generic";

  const isTurnCalled = event_type === "turn_called" || event_type === "session_completed";
  const isNearTurn = event_type === "near_turn";
  const isExpired = event_type === "session_expired";

  const vibrate = isTurnCalled
    ? [300, 100, 300, 100, 600]  // urgent: long-short-long
    : isNearTurn
    ? [200, 100, 200]            // moderate: two pulses
    : isExpired
    ? [100, 50, 100]             // soft: expired
    : [150];                     // generic: single tap

  const notifOptions = {
    body,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: `queueless-${event_type}`,
    renotify: true,
    requireInteraction: isTurnCalled,
    vibrate,
    silent: false,
    data: {
      event_type,
      session_id: payload.session_id,
      url: self.location.origin + "/#/queue",
    },
    actions: isTurnCalled
      ? [{ action: "open", title: "Go to counter →" }]
      : isNearTurn
      ? [{ action: "open", title: "Check my position" }]
      : [],
  };

  event.waitUntil(
    self.registration.showNotification(title, notifOptions)
  );
});

// ── Notification click ──────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? self.location.origin + "/#/queue";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.postMessage({
              type: "NOTIFICATION_CLICK",
              data: event.notification.data,
            });
            return;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ── Push subscription renewal ───────────────────────────────────────────────
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: event.oldSubscription?.options?.applicationServerKey,
      })
      .then((newSubscription) => {
        return clients.matchAll({ includeUncontrolled: true }).then((allClients) => {
          for (const client of allClients) {
            client.postMessage({
              type: "PUSH_SUBSCRIPTION_RENEWED",
              subscription: newSubscription.toJSON(),
            });
          }
        });
      })
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});