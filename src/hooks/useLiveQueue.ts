import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchQueueStatus,
  autoTick,
  checkIn,
  type QueueStatusResponse,
} from "../api/queue";

const POLL_INTERVAL_MS = 5000; // 5 seconds

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER ?? "";
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS ?? "";

interface UseLiveQueueOptions {
  sessionId: string;
  institutionId: number;
  onServed: () => void;
}

interface LiveQueueState {
  queueNumber: number;
  currentServing: number;
  peopleAhead: number;
  status: QueueStatusResponse["status"];
  nearTurnNotified: boolean;
  isFlashing: boolean;
  loading: boolean;
  error: string | null;
}

export function useLiveQueue({
  sessionId,
  institutionId,
  onServed,
}: UseLiveQueueOptions): LiveQueueState {
  const [state, setState] = useState<LiveQueueState>({
    queueNumber: 0,
    currentServing: 0,
    peopleAhead: 0,
    status: "waiting",
    nearTurnNotified: false,
    isFlashing: false,
    loading: true,
    error: null,
  });

  const onServedRef = useRef(onServed);
  useEffect(() => {
    onServedRef.current = onServed;
  }, [onServed]);
  const servedCalledRef = useRef(false);
  const checkInCalledRef = useRef(false);

  const flash = useCallback(() => {
    setState((s) => ({ ...s, isFlashing: true }));
    setTimeout(() => setState((s) => ({ ...s, isFlashing: false })), 400);
  }, []);

  const applyStatus = useCallback(
    (data: QueueStatusResponse) => {
      setState((prev) => {
        const didAdvance = data.current_serving_number !== prev.currentServing;
        if (didAdvance) flash();
        return {
          queueNumber: data.queue_number,
          currentServing: data.current_serving_number,
          peopleAhead: data.people_ahead,
          status: data.status,
          nearTurnNotified: data.near_turn_notified,
          isFlashing: prev.isFlashing,
          loading: false,
          error: null,
        };
      });

      if (data.status === "serving" && !checkInCalledRef.current) {
        checkInCalledRef.current = true;
        checkIn(sessionId).catch(() => {});
      }

      if (
        (data.status === "serving" || data.status === "served") &&
        !servedCalledRef.current
      ) {
        servedCalledRef.current = true;
        setTimeout(() => onServedRef.current(), 5000);
      }
    },
    [flash, sessionId]
  );

  useEffect(() => {
    if (!sessionId) return;
    servedCalledRef.current = false;
    checkInCalledRef.current = false;
    let stopped = false;

    fetchQueueStatus(sessionId)
      .then((data) => { if (!stopped) applyStatus(data); })
      .catch((err: Error) => {
        if (!stopped)
          setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    const tick = () => {
      if (stopped) return;

      try {
        if (ADMIN_USER && ADMIN_PASS) {
          autoTick(
            { username: ADMIN_USER, password: ADMIN_PASS },
            false
          ).catch(() => undefined);
        }
      } catch {
        // ignore 
      }

      fetchQueueStatus(sessionId)
        .then((data) => { if (!stopped) applyStatus(data); })
        .catch((err: Error) => {
          if (!stopped)
            setState((s) => ({
              ...s,
              loading: false,
              error: err instanceof Error ? err.message : "Failed to fetch status",
            }));
        });
    };

    const id = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [sessionId, institutionId, applyStatus]);

  return state;
}