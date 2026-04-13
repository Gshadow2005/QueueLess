export interface Queue {
  id: string;
  branchName: string;
  currentServing: number;
  yourNumber: number;
  estimatedWaitMinutes: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  message: string;
  queueId: string;
  timestamp: Date;
  read: boolean;
}

export type QueueStatus = "waiting" | "almost" | "now" | "done";