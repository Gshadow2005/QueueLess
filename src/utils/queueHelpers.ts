import type { QueueStatus } from "../types/queue";

export function getSpotsAway(current: number, yours: number): number {
  return Math.max(0, yours - current);
}

export function getQueueStatus(spotsAway: number): QueueStatus {
  if (spotsAway === 0) return "now";
  if (spotsAway <= 3) return "almost";
  return "waiting";
}

export function formatQueueNumber(n: number): string {
  return `#${String(n).padStart(2, "0")}`;
}

export function estimateWaitMinutes(spotsAway: number, avgMinutesPerPerson = 3): number {
  return Math.ceil(spotsAway * avgMinutesPerPerson);
}