import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchNotifications,
  acknowledgeNotification,
  type APINotification,
} from "../api/notifications";

const POLL_INTERVAL_MS = 15000;

interface UseNotificationsOptions {
  sessionId: string | null;
  onNearTurn?: () => void;
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

export function useNotifications({
  sessionId,
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
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((n) => n + 1), []);

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
            onNearTurnRef.current?.();
            acknowledgeNotification(sessionId, notification.id, {
              delivered: true,
            }).catch(() => { /* non-fatal */ });
          } else if (notification.event_type === "turn_called") {
            onTurnCalledRef.current?.();
            acknowledgeNotification(sessionId, notification.id, {
              delivered: true,
            }).catch(() => { /* non-fatal */ });
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
            error: err instanceof Error ? err.message : "Failed to fetch notifications",
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
  }, [sessionId, tick]);

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