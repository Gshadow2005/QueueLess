import { useState, useCallback, useEffect } from "react";
import { type Institution } from "../types/institution";
import { joinQueue } from "../api/queue";
import {
  saveSession,
  loadSession,
  clearSession,
  hasActiveSession,
  type PersistedSession,
} from "../utils/storage";
import InstitutionList from "../components/queue/InstitutionList";
import JoinQueue from "../components/queue/JoinQueue";
import EnterQueueNumber from "../components/queue/Enterqueuenumber";
import LiveTracker from "../components/queue/LiveTracker";
import DoneScreen from "../components/queue/DoneScreen";

type Screen = "list" | "join" | "enter-number" | "tracker" | "done";

interface AppState {
  institution: Institution | null;
  sessionId: string | null;
  yourNumber: number;
  joinedAt: Date | null;
  waitMinutes: number;
  cancelled: boolean;
  pendingPhone: string;
  pendingNotify: boolean;
}

interface AppPageProps {
  onBack: () => void;
}

function persistedSessionToInstitution(s: PersistedSession): Institution {
  return {
    id: s.institutionId,
    name: s.institutionName,
    type: s.institutionType,
    address: s.institutionAddress,
    status: s.institutionStatus,
    serving: s.institutionServing,
    inQueue: s.institutionInQueue,
    waitPer: s.institutionWaitPer,
  };
}

export default function AppPage({ onBack }: AppPageProps) {
  const [screen, setScreen] = useState<Screen>(() => {
    if (hasActiveSession()) return "tracker";
    return "list";
  });

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [state, setState] = useState<AppState>(() => {
    const saved = loadSession();
    if (saved) {
      return {
        institution: persistedSessionToInstitution(saved),
        sessionId: saved.sessionId,
        yourNumber: saved.yourNumber,
        joinedAt: new Date(saved.joinedAt),
        waitMinutes: 0,
        cancelled: false,
        pendingPhone: "",
        pendingNotify: true,
      };
    }
    return {
      institution: null,
      sessionId: null,
      yourNumber: 0,
      joinedAt: null,
      waitMinutes: 0,
      cancelled: false,
      pendingPhone: "",
      pendingNotify: true,
    };
  });

  useEffect(() => {
    if (
      state.sessionId &&
      state.institution &&
      state.joinedAt &&
      screen === "tracker"
    ) {
      const toSave: PersistedSession = {
        sessionId: state.sessionId,
        institutionId: state.institution.id,
        institutionName: state.institution.name,
        institutionType: state.institution.type,
        institutionAddress: state.institution.address,
        institutionStatus: state.institution.status,
        institutionServing: state.institution.serving,
        institutionInQueue: state.institution.inQueue,
        institutionWaitPer: state.institution.waitPer,
        yourNumber: state.yourNumber,
        joinedAt: state.joinedAt.toISOString(),
      };
      saveSession(toSave);
    }
  }, [state.sessionId, state.institution, state.yourNumber, state.joinedAt, screen]);

  const handleSelectInst = (inst: Institution) => {
    if (hasActiveSession()) return;
    setState((s) => ({ ...s, institution: inst }));
    setJoinError(null);
    setScreen("join");
  };

  const handleJoin = (phone: string, notifyEnabled: boolean) => {
    setState((s) => ({ ...s, pendingPhone: phone, pendingNotify: notifyEnabled }));
    setScreen("enter-number");
  };

  const handleNumberSubmit = async (queueNumber: number) => {
    if (!state.institution) return;

    if (hasActiveSession()) {
      setJoinError("You already have an active queue session on this device.");
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      const res = await joinQueue({
        institution_id: state.institution.id,
        queue_number: queueNumber,
        phone_number: state.pendingPhone || undefined,
        browser_push_opt_in: state.pendingNotify,
        near_turn_threshold: 5, // We handle 3 locally, but set 5 for backend notifications
      });

      const joinedAt = new Date();

      const toSave: PersistedSession = {
        sessionId: res.session_id,
        institutionId: state.institution.id,
        institutionName: state.institution.name,
        institutionType: state.institution.type,
        institutionAddress: state.institution.address,
        institutionStatus: state.institution.status,
        institutionServing: state.institution.serving,
        institutionInQueue: state.institution.inQueue,
        institutionWaitPer: state.institution.waitPer,
        yourNumber: res.queue_number,
        joinedAt: joinedAt.toISOString(),
      };
      saveSession(toSave);

      setState((s) => ({
        ...s,
        sessionId: res.session_id,
        yourNumber: res.queue_number,
        joinedAt,
      }));

      setScreen("tracker");
    } catch (err: unknown) {
      setJoinError(err instanceof Error ? err.message : "Failed to join queue.");
    } finally {
      setJoining(false);
    }
  };

  const handleDone = useCallback((waitMinutes: number, cancelled: boolean) => {
    clearSession();
    setState((s) => ({ ...s, waitMinutes, cancelled }));
    setScreen("done");
  }, []);

  const handleGoHome = () => onBack();

  const handleReset = () => {
    clearSession();
    setState({
      institution: null,
      sessionId: null,
      yourNumber: 0,
      joinedAt: null,
      waitMinutes: 0,
      cancelled: false,
      pendingPhone: "",
      pendingNotify: true,
    });
    setScreen("list");
  };

  const handleBack = () => {
    if (screen === "join") setScreen("list");
    else if (screen === "enter-number") setScreen("join");
    else onBack();
  };

  const showBack = screen === "join" || screen === "list" || screen === "enter-number";

  const title =
    screen === "list" ? null :
    screen === "join" ? (state.institution?.name.split("–")[0].trim() ?? "Join Queue") :
    screen === "enter-number" ? "Enter Queue Number" :
    screen === "tracker" ? (state.institution?.name.split("–")[0].trim() ?? "Live Tracker") :
    "All done!";

  return (
    <div style={{ minHeight: "100vh", background: "var(--off)", color: "var(--navy)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(13,43,110,0.12)" }}>
        <div className="app-nav-inner">
          {screen === "list" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.375rem" }}>⏱</span>
              <span className="font-head" style={{ fontSize: "1.25rem", color: "var(--navy)" }}>
                Queue<strong style={{ fontWeight: 800 }}>Less</strong>
              </span>
            </div>
          ) : (
            <span className="font-head" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </span>
          )}

          <div style={{ flex: 1 }} />

          {screen === "tracker" && (
            <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "4px 12px", borderRadius: 999, background: "var(--sky-pale)", color: "var(--navy-light)", border: "1px solid var(--sky-light)", letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0 }}>
              Live
            </span>
          )}

          {screen === "list" && (
            <div className="app-nav-links">
              <span style={{ fontSize: "0.85rem", color: "#6B82A8" }}>Queue management</span>
            </div>
          )}
        </div>
      </nav>

      <div className="app-page-container">
        {showBack && (
          <div style={{ marginBottom: "1.25rem" }}>
            <button
              onClick={handleBack}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#6B82A8", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B82A8")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 3L5 8l5 5" />
              </svg>
              {screen === "list" ? "Home" : "Back"}
            </button>
          </div>
        )}

        {screen === "list" && (
          <InstitutionList
            onSelect={handleSelectInst}
            hasActiveSession={hasActiveSession()}
          />
        )}

        {screen === "join" && state.institution && (
          <JoinQueue
            institution={state.institution}
            onBack={() => setScreen("list")}
            onJoin={handleJoin}
            joining={joining}
            joinError={joinError}
          />
        )}

        {screen === "enter-number" && state.institution && (
          <EnterQueueNumber
            institution={state.institution}
            onSubmit={handleNumberSubmit}
            onBack={() => setScreen("join")}
            joining={joining}
            joinError={joinError}
          />
        )}

        {screen === "tracker" && state.institution && state.joinedAt && state.sessionId && (
          <LiveTracker
            institution={state.institution}
            sessionId={state.sessionId}
            yourNumber={state.yourNumber}
            joinedAt={state.joinedAt}
            onDone={handleDone}
          />
        )}

        {screen === "done" && state.institution && (
          <DoneScreen
            institution={state.institution}
            yourNumber={state.yourNumber}
            waitMinutes={state.waitMinutes}
            cancelled={state.cancelled}
            onReset={handleReset}
            onGoHome={handleGoHome}
          />
        )}
      </div>

      <style>{`
          @media (max-width: 768px) { .app-nav-links { display: none; } }
          .app-page-container { max-width: 96rem; margin: 0 auto; padding: 1.5rem 1.5rem; }
          @media (min-width: 640px) { .app-page-container { padding: 1.5rem 2.5rem; } }
          @media (min-width: 1280px) { .app-page-container { padding: 1.5rem 4rem; } }
          .app-nav-inner { max-width: 96rem; margin: 0 auto; padding: 0 1.5rem; height: 64px; display: flex; align-items: center; gap: 1rem; }
          @media (min-width: 640px) { .app-nav-inner { padding: 0 2.5rem; } }
          @media (min-width: 1280px) { .app-nav-inner { padding: 0 4rem; } }
        `}</style>
    </div>
  );
}