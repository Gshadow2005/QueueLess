/**
 * src/utils/pushManager.ts
 *
 * Handles the full Web Push lifecycle:
 *   1. Register the service worker (sw.js)
 *   2. Request / confirm notification permission
 *   3. Subscribe via PushManager with the VAPID public key
 *   4. POST the subscription to the QueueLess backend
 *   5. Listen for SW messages (subscription renewal, notification clicks)
 */

import apiFetch from "../api/clients";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

// ── Helpers ─────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i);
  }
  return view;
}

/** Check whether the current browser/OS supports Web Push */
export function isPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// ── Service Worker registration ──────────────────────────────────────────────

let swRegistrationPromise: Promise<ServiceWorkerRegistration> | null = null;

export async function getSwRegistration(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }

  if (!swRegistrationPromise) {
    // register() only queues the SW install — it resolves before the SW is active.
    // navigator.serviceWorker.ready resolves only once a SW is fully activated,
    // which is what PushManager.subscribe() requires.
    swRegistrationPromise = navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready);
  }

  return swRegistrationPromise;
}

// ── Permission ───────────────────────────────────────────────────────────────

export async function requestPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  const result = await Notification.requestPermission();
  return result;
}

// ── Subscribe ────────────────────────────────────────────────────────────────

export async function subscribeToPush(sessionId: string): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn("[QueueLess Push] Web Push not supported on this device.");
    return false;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn(
      "[QueueLess Push] VITE_VAPID_PUBLIC_KEY is not set. Web Push is disabled. " +
        "Generate a key pair with: npx web-push generate-vapid-keys"
    );
    return false;
  }

  const permission = await requestPermission();
  if (permission !== "granted") return false;

  try {
    const registration = await getSwRegistration();

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    await postSubscriptionToBackend(sessionId, subscription);
    return true;
  } catch (err) {
    console.error("[QueueLess Push] Failed to subscribe:", err);
    return false;
  }
}

// ── Post to backend ──────────────────────────────────────────────────────────

async function postSubscriptionToBackend(
  sessionId: string,
  subscription: PushSubscription
): Promise<void> {
  const json = subscription.toJSON();
  const keys = json.keys as Record<string, string> | undefined;

  if (!json.endpoint || !keys?.p256dh || !keys?.auth) {
    throw new Error("Incomplete push subscription object.");
  }

  await apiFetch(`/api/notifications/entries/${sessionId}/push-subscription/`, {
    method: "POST",
    body: JSON.stringify({
      endpoint: json.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    }),
  });
}

// ── SW message listener (subscription renewal + notification clicks) ─────────

type SwMessageHandler = (event: { type: string; data?: unknown }) => void;
const messageHandlers = new Set<SwMessageHandler>();

let listenerAttached = false;

export function onSwMessage(handler: SwMessageHandler): () => void {
  if (!listenerAttached && "serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event: MessageEvent) => {
      for (const h of messageHandlers) h(event.data);
    });
    listenerAttached = true;
  }

  messageHandlers.add(handler);
  return () => messageHandlers.delete(handler);
}

// ── Unsubscribe (for cleanup) ────────────────────────────────────────────────

export async function unsubscribeFromPush(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) await subscription.unsubscribe();
  } catch (err) {
    console.warn("[QueueLess Push] Failed to unsubscribe:", err);
  }
}