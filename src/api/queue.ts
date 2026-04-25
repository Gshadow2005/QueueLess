import apiFetch from "./clients";

// ── Institution types ──────────────────────────────────────────────────────

export interface APIInstitution {
  id: number;
  name: string;
  institution_type: "bank" | "government" | "utility" | "other";
  address: string;
  api_endpoint: string;
  status: "open" | "closed" | "paused";
  is_active: boolean;
  is_available_for_queue: boolean;
  queue_waiting_count: number;
  current_serving_number: number;
  next_queue_number: number;
}

// ── Queue types ────────────────────────────────────────────────────────────

export interface QueueJoinPayload {
  institution_id: number;
  queue_number: number;
  phone_number?: string;
  browser_push_opt_in?: boolean;
  near_turn_threshold?: number;
}

export interface QueueJoinResponse {
  session_id: string;
  institution_id: number;
  queue_number: number;
  current_serving_number: number;
  status: "waiting" | "notified" | "serving" | "served" | "expired" | "cancelled";
  near_turn_threshold: number;
  near_turn_notified: boolean;
  issued_at: string;
  updated_at: string;
  people_ahead: number;
}

export interface QueueStatusResponse {
  session_id: string;
  institution_id: number;
  queue_number: number;
  current_serving_number: number;
  status: "waiting" | "notified" | "serving" | "served" | "expired" | "cancelled";
  near_turn_threshold: number;
  near_turn_notified: boolean;
  issued_at: string;
  updated_at: string;
  turn_called_at: string | null;
  checked_in_at: string | null;
  people_ahead: number;
}

export interface SimulateTickResponse {
  institution_id: number;
  randomized: boolean;
  increment: number;
  current_serving_number: number;
  served_count: number;
  notified_count: number;
  message?: string;
}

// ── API calls ──────────────────────────────────────────────────────────────

export const fetchInstitutions = () =>
  apiFetch<APIInstitution[]>("/api/institutions/");

export const fetchInstitution = (id: number) =>
  apiFetch<APIInstitution>(`/api/institutions/${id}/`);

export const joinQueue = (payload: QueueJoinPayload) =>
  apiFetch<QueueJoinResponse>("/api/queue/join/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchQueueStatus = (sessionId: string) =>
  apiFetch<QueueStatusResponse>(`/api/queue/entries/${sessionId}/status/`);

export const simulateTick = (
  institutionId: number,
  adminCredentials: { username: string; password: string }
) =>
  apiFetch<SimulateTickResponse>(
    `/api/queue/institutions/${institutionId}/simulate-tick/?randomize=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          btoa(`${adminCredentials.username}:${adminCredentials.password}`),
      },
    }
  );