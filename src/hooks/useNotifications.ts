import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchNotifications,
  acknowledgeNotification,
  type APINotification,
} from "../api/notifications";

const POLL_INTERVAL_MS = 15000;

interface UseNotificationsOptions {
  sessionId: string | null;
  yourNumber: number;
  peopleAhead: number;
  onNearTurn?: (spotsLeft: number) => void;
  onTurnCalled?: () => void;
}

interface NotificationsState {
  notifications: APINotification[];
  unreadCount: number;
  latestNearTurn: APINotification | null;
  latestTurnCalled: APINotification | null;
  loading: boolean;
  error: string | null;
}

function safeNotify(title: string, options: NotificationOptions & { tag: string }) {
  try {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    new Notification(title, options);
  } catch {
    // ignore
  }
}

export function useNotifications({
  sessionId,
  yourNumber,
  peopleAhead,
  onNearTurn,
  onTurnCalled,
}: UseNotificationsOptions): NotificationsState & {
  markAllRead: () => Promise<void>;
  refetch: () => void;
} {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    latestNearTurn: null,
    latestTurnCalled: null,
    loading: false,
    error: null,
  });

  const onNearTurnRef = useRef(onNearTurn);
  const onTurnCalledRef = useRef(onTurnCalled);
  onNearTurnRef.current = onNearTurn;
  onTurnCalledRef.current = onTurnCalled;

  const firedCallbacksRef = useRef<Set<number>>(new Set());
  const firedLocalThresholdsRef = useRef<Set<number>>(new Set());

  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((n) => n + 1), []);

  // ── Local threshold check (3 spots) ───────────────────────────────────
  useEffect(() => {
    if (peopleAhead <= 0) return;

    const LOCAL_THRESHOLD = 3;

    if (
      peopleAhead <= LOCAL_THRESHOLD &&
      !firedLocalThresholdsRef.current.has(LOCAL_THRESHOLD)
    ) {
      firedLocalThresholdsRef.current.add(LOCAL_THRESHOLD);
      onNearTurnRef.current?.(LOCAL_THRESHOLD);

      safeNotify("Only 3 spots left!", {
        body: `Queue #${String(yourNumber).padStart(2, "0")} - head back now, you're almost up!`,
        icon: "/favicon.svg",
        tag: "queueless-3-spots",
        requireInteraction: true,
      });
    }
  }, [peopleAhead, yourNumber]);

  // ── Backend notification polling ───────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;

    let stopped = false;

    const poll = async () => {
      if (stopped) return;
      try {
        const data = await fetchNotifications(sessionId, { limit: 50 });
        if (stopped) return;

        const undelivered = data.results.filter((n) => !n.delivered);
        const unreadCount = undelivered.length;

        const latestNearTurn =
          data.results.find((n) => n.event_type === "near_turn") ?? null;
        const latestTurnCalled =
          data.results.find((n) => n.event_type === "turn_called") ?? null;

        for (const notification of undelivered) {
          if (firedCallbacksRef.current.has(notification.id)) continue;
          firedCallbacksRef.current.add(notification.id);

          if (notification.event_type === "near_turn") {
            onNearTurnRef.current?.(5);

            safeNotify("5 spots left!", {
              body: `Queue #${String(yourNumber).padStart(2, "0")} - you have about 5 people ahead. Start heading back!`,
              icon: "/favicon.svg",
              tag: "queueless-5-spots",
              requireInteraction: true,
            });

            acknowledgeNotification(sessionId, notification.id, {
              delivered: true,
            }).catch(() => {});
          } else if (notification.event_type === "turn_called") {
            onTurnCalledRef.current?.();

            safeNotify("It's your turn!", {
              body: `Queue #${String(yourNumber).padStart(2, "0")} is now being served. Please proceed to the counter.`,
              icon: "/favicon.svg",
              tag: "queueless-turn-called",
              requireInteraction: true,
            });

            acknowledgeNotification(sessionId, notification.id, {
              delivered: true,
            }).catch(() => {});
          }
        }

        setState({
          notifications: data.results,
          unreadCount,
          latestNearTurn,
          latestTurnCalled,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!stopped) {
          setState((s) => ({
            ...s,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Failed to fetch notifications",
          }));
        }
      }
    };

    setState((s) => ({ ...s, loading: true }));
    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [sessionId, yourNumber, tick]);

  const markAllRead = useCallback(async () => {
    if (!sessionId) return;
    const undelivered = state.notifications.filter((n) => !n.delivered);
    await Promise.allSettled(
      undelivered.map((n) =>
        acknowledgeNotification(sessionId, n.id, { delivered: true })
      )
    );
    refetch();
  }, [sessionId, state.notifications, refetch]);

  return { ...state, markAllRead, refetch };
}