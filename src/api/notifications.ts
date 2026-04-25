import apiFetch from "./clients";

export type NotificationChannel = "browser" | "sms" | "system";
export type NotificationEventType =
  | "near_turn"
  | "turn_called"
  | "session_expired"
  | "session_completed"
  | "generic";

export interface APINotification {
  id: number;
  session_id: string;
  institution_id: number;
  queue_number: number;
  channel: NotificationChannel;
  event_type: NotificationEventType;
  message: string;
  delivered: boolean;
  external_reference: string;
  error_detail: string;
  sent_at: string;
  updated_at: string;
}

export interface NotificationsListResponse {
  session_id: string;
  institution_id: number;
  queue_number: number;
  count: number;
  results: APINotification[];
}

export interface NotificationAckPayload {
  delivered: boolean;
  external_reference?: string;
  error_detail?: string;
}

export const fetchNotifications = (
  sessionId: string,
  params?: {
    delivered?: boolean;
    event_type?: NotificationEventType;
    limit?: number;
  }
) => {
  const query = new URLSearchParams();
  if (params?.delivered !== undefined)
    query.set("delivered", params.delivered ? "true" : "false");
  if (params?.event_type) query.set("event_type", params.event_type);
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return apiFetch<NotificationsListResponse>(
    `/api/notifications/entries/${sessionId}/notifications/${qs ? `?${qs}` : ""}`
  );
};

export const acknowledgeNotification = (
  sessionId: string,
  notificationId: number,
  payload: NotificationAckPayload
) =>
  apiFetch<APINotification>(
    `/api/notifications/entries/${sessionId}/notifications/${notificationId}/ack/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );