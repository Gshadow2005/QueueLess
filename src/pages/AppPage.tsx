import { useState, useCallback } from "react";
import { type Institution } from "../data/institutions";
import InstitutionList from "../components/app/InstitutionList";
import JoinQueue from "../components/app/JoinQueue";
import LiveTracker from "../components/app/LiveTracker";
import DoneScreen from "../components/app/DoneScreen";

type Screen = "list" | "join" | "tracker" | "done";

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

  const topBarConfig: Record<Screen, { showBack: boolean; title: string; badge?: string }> = {
    list: { showBack: false, title: "" },
    join: {
      showBack: true,
      title: state.institution
        ? `Join – ${state.institution.name.split("–")[0].trim()}`
        : "Join Queue",
    },
    tracker: {
      showBack: false,
      title: state.institution?.name.split("–")[0].trim() || "Live Tracker",
      badge: trackerBadge,
    },
    done: { showBack: false, title: "All done!" },
  };

  const config = topBarConfig[screen];

  const handleSelectInst = (inst: Institution) => {
    setState((s) => ({ ...s, institution: inst }));
    setScreen("join");
  };

  const handleJoin = (_phone: string, _notifyEnabled: boolean) => {
    if (!state.institution) return;
    const inst = state.institution;
    const yourNum = inst.serving + inst.inQueue + 1;
    setState((s) => ({
      ...s,
      yourNumber: yourNum,
      joinedAt: new Date(),
    }));
    setTrackerBadge("Waiting");
    setScreen("tracker");
  };

  const handleDone = useCallback((waitMinutes: number, cancelled: boolean) => {
    setState((s) => ({ ...s, waitMinutes, cancelled }));
    setScreen("done");
  }, []);

  const handleReset = () => {
    setState({
      institution: null,
      yourNumber: 0,
      joinedAt: null,
      waitMinutes: 0,
      cancelled: false,
    });
    setTrackerBadge("Waiting");
    setScreen("list");
  };

  const handleBack = () => {
    if (screen === "join") setScreen("list");
    else onBack();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--off)", color: "var(--navy)" }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 flex items-center gap-3 px-5 h-14"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(13,43,110,0.12)",
        }}
      >
        {/* Back button */}
        {(screen === "join" || screen === "list") && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm transition-colors duration-150 mr-1"
            style={{ color: "#6B82A8", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B82A8")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5" />
            </svg>
            {screen === "list" ? "Home" : "Back"}
          </button>
        )}

        {/* Logo or title */}
        {screen === "list" ? (
          <>
            <span className="text-xl">⏱</span>
            <span className="font-head text-lg" style={{ color: "var(--navy)" }}>
              Queue<strong className="font-extrabold">Less</strong>
            </span>
          </>
        ) : (
          <span className="font-head text-base font-bold" style={{ color: "var(--navy)" }}>
            {config.title}
          </span>
        )}

        <div className="flex-1" />

        {/* Badge */}
        {screen === "tracker" && (
          <span
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{
              background: "var(--sky-pale)",
              color: "var(--navy-light)",
              border: "1px solid var(--sky-light)",
              letterSpacing: "0.04em",
            }}
          >
            {trackerBadge}
          </span>
        )}
      </div>

      {/* Screens */}
      {screen === "list" && (
        <InstitutionList onSelect={handleSelectInst} />
      )}

      {screen === "join" && state.institution && (
        <JoinQueue
          institution={state.institution}
          onBack={() => setScreen("list")}
          onJoin={handleJoin}
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
  );
}