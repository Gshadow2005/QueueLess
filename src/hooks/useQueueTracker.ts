import { useState, useEffect } from "react";
import { getSpotsAway, getQueueStatus } from "../utils/queueHelpers";
import type { QueueStatus } from "../types/queue";

interface UseQueueTrackerOptions {
  initialCurrent?: number;
  yourNumber?: number;
  intervalMs?: number;
}

interface QueueTrackerResult {
  currentServing: number;
  yourNumber: number;
  spotsAway: number;
  status: QueueStatus;
  progressPct: number;
  isFlashing: boolean;
}

export function useQueueTracker({
  initialCurrent = 20,
  yourNumber = 35,
  intervalMs = 1800,
}: UseQueueTrackerOptions = {}): QueueTrackerResult {
  const [currentServing, setCurrentServing] = useState(initialCurrent);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServing((n) => {
        if (n >= yourNumber - 1) return initialCurrent;
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 400);
        return n + 1;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [yourNumber, initialCurrent, intervalMs]);

  const spotsAway = getSpotsAway(currentServing, yourNumber);
  const status: QueueStatus = getQueueStatus(spotsAway);
  const progressPct = Math.max(0, 100 - (spotsAway / 15) * 100);

  return { currentServing, yourNumber, spotsAway, status, progressPct, isFlashing };
}