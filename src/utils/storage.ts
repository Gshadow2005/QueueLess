const STORAGE_KEYS = {
  SESSION: "ql_active_session",
  DEVICE_ID: "ql_device_id",
} as const;

export interface PersistedSession {
  sessionId: string;
  institutionId: number;
  institutionName: string;
  institutionType: "bank" | "government" | "utility";
  institutionAddress: string;
  institutionStatus: "open" | "busy" | "closed";
  institutionServing: number;
  institutionInQueue: number;
  institutionWaitPer: number;
  yourNumber: number;
  joinedAt: string;
}

export function getDeviceId(): string {
  let id = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  }
  return id;
}

export function saveSession(session: PersistedSession): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function hasActiveSession(): boolean {
  return localStorage.getItem(STORAGE_KEYS.SESSION) !== null;
}