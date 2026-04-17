import { useState, useCallback } from "react";
import { type Institution } from "../data/institutions";
import InstitutionList from "../components/app/InstitutionList";
import JoinQueue from "../components/app/JoinQueue";
import EnterQueueNumber from "../components/app/Enterqueuenumber";
import LiveTracker from "../components/app/LiveTracker";
import DoneScreen from "../components/app/DoneScreen";

type Screen = "list" | "join" | "enter-number" | "tracker" | "done";

interface AppState {
  institution: Institution | null;
  yourNumber: number;
  joinedAt: Date | null;
  waitMinutes: number;
  cancelled: boolean;
}

interface AppPageProps {
  onBack: () => void;
}

export default function AppPage({ onBack }: AppPageProps) {
  const [screen, setScreen] = useState<Screen>("list");
  const [trackerBadge, setTrackerBadge] = useState("Waiting");
  const [state, setState] = useState<AppState>({
    institution: null,
    yourNumber: 0,
    joinedAt: null,
    waitMinutes: 0,
    cancelled: false,
  });

  const handleSelectInst = (inst: Institution) => {
    setState((s) => ({ ...s, institution: inst }));
    setScreen("join");
  };

  // After filling in optional details, move to manual number entry
  const handleJoin = (phone: string, notifyEnabled: boolean) => {
    if (!state.institution) return;
    // Store optional fields in state if needed later (e.g. for SMS)
    console.log("Optional details:", { phone, notifyEnabled });
    setScreen("enter-number");
  };

  // Called when user manually submits their queue number
  const handleNumberSubmit = (queueNumber: number) => {
    setState((s) => ({ ...s, yourNumber: queueNumber, joinedAt: new Date() }));
    setTrackerBadge("Waiting");
    setScreen("tracker");
  };

  const handleDone = useCallback((waitMinutes: number, cancelled: boolean) => {
    setState((s) => ({ ...s, waitMinutes, cancelled }));
    setScreen("done");
  }, []);

  const handleReset = () => {
    setState({ institution: null, yourNumber: 0, joinedAt: null, waitMinutes: 0, cancelled: false });
    setTrackerBadge("Waiting");
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
    screen === "enter-number" ? "Your Queue Number" :
    screen === "tracker" ? (state.institution?.name.split("–")[0].trim() ?? "Live Tracker") :
    "All done!";

  return (
    <div style={{ minHeight: "100vh", background: "var(--off)", color: "var(--navy)" }}>
      {/* ── Top bar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(13,43,110,0.12)",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 1.25rem",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Back button */}
          {showBack && (
            <button
              onClick={handleBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.875rem",
                color: "#6B82A8",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                padding: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B82A8")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 3L5 8l5 5" />
              </svg>
              {screen === "list" ? "Home" : "Back"}
            </button>
          )}

          {/* Logo / title */}
          {screen === "list" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.375rem" }}>⏱</span>
              <span className="font-head" style={{ fontSize: "1.25rem", color: "var(--navy)" }}>
                Queue<strong style={{ fontWeight: 800 }}>Less</strong>
              </span>
            </div>
          ) : (
            <span
              className="font-head"
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--navy)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </span>
          )}

          <div style={{ flex: 1 }} />

          {/* Tracker badge */}
          {screen === "tracker" && (
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 999,
                background: "var(--sky-pale)",
                color: "var(--navy-light)",
                border: "1px solid var(--sky-light)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {trackerBadge}
            </span>
          )}

          {/* Nav links on desktop (list screen only) */}
          {screen === "list" && (
            <div className="app-nav-links">
              <span style={{ fontSize: "0.85rem", color: "#6B82A8" }}>Queue management</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── Page layout ── */}
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "1.5rem 1.25rem",
        }}
      >
        {screen === "list" && <InstitutionList onSelect={handleSelectInst} />}

        {screen === "join" && state.institution && (
          <JoinQueue
            institution={state.institution}
            onBack={() => setScreen("list")}
            onJoin={handleJoin}
          />
        )}

        {screen === "enter-number" && state.institution && (
          <EnterQueueNumber
            institution={state.institution}
            onSubmit={handleNumberSubmit}
            onBack={() => setScreen("join")}
          />
        )}

        {screen === "tracker" && state.institution && state.joinedAt && (
          <LiveTracker
            institution={state.institution}
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
          />
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .app-nav-links { display: none; }
        }
      `}</style>
    </div>
  );
}