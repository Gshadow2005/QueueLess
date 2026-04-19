import { useState, useEffect, useRef, useCallback } from "react";
import { fetchQueueStatus, simulateTick, type QueueStatusResponse } from "../api/queue";

const POLL_INTERVAL_MS = 10000;

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
  onServedRef.current = onServed;

  const servedCalledRef = useRef(false);

  const flash = useCallback(() => {
    setState((s) => ({ ...s, isFlashing: true }));
    setTimeout(() => setState((s) => ({ ...s, isFlashing: false })), 400);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    servedCalledRef.current = false;

    let stopped = false;

    const tick = async () => {
      if (stopped) return;

      if (ADMIN_USER && ADMIN_PASS) {
        await simulateTick(institutionId, {
          username: ADMIN_USER,
          password: ADMIN_PASS,
        }).catch(() => undefined);
      }

      try {
        const data = await fetchQueueStatus(sessionId);
        if (stopped) return;

        setState((prev) => {
          const didAdvance =
            data.current_serving_number !== prev.currentServing;
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

        if (data.status === "served" && !servedCalledRef.current) {
          servedCalledRef.current = true;
          setTimeout(() => onServedRef.current(), 900);
        }
      } catch (err: unknown) {
        if (!stopped) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to fetch status",
          }));
        }
      }
    };

    tick();
    const id = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [sessionId, institutionId, flash]);

  return state;
}