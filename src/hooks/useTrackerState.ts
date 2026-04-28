import { useCallback, useEffect, useState } from "react";
import { type Institution } from "../types/institution";
import { formatQueueNumber } from "../utils/queueHelpers";
import { useLiveQueue } from "./useLiveQueue";
import { useNotifications } from "./useNotifications";
import { useToast } from "./useToast";
import {
  isPushSupported,
  subscribeToPush,
  onSwMessage,
} from "../utils/pushManager";

function getSafeNotifPermission(): NotificationPermission {
  try {
    if (typeof Notification === "undefined") return "denied";
    return Notification.permission;
  } catch {
    return "denied";
  }
}

interface UseTrackerStateProps {
  institution: Institution;
  sessionId: string;
  yourNumber: number;
  joinedAt: Date;
  onDone: (waitMinutes: number, cancelled: boolean) => void;
}

export function useTrackerState({
  institution,
  sessionId,
  yourNumber,
  joinedAt,
  onDone,
}: UseTrackerStateProps) {
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>(getSafeNotifPermission());
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  const { toasts, showToast, removeToast } = useToast();

  // ── On mount: register SW + listen for SW messages ──────────────────────
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      subscribeToPush(sessionId).then((ok) => {
        setPushSubscribed(ok);
        if (ok) setNotifPermission("granted");
      });
    }

    const unsub = onSwMessage((msg) => {
      if (msg.type === "PUSH_SUBSCRIPTION_RENEWED") {
        subscribeToPush(sessionId).catch(() => {});
      }
      if (msg.type === "NOTIFICATION_CLICK") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    return () => unsub();
  }, [sessionId]);

  // ── Live queue polling ───────────────────────────────────────────────────
  const {
    currentServing,
    peopleAhead,
    status,
    nearTurnNotified,
    isFlashing,
    loading: queueLoading,
    error,
  } = useLiveQueue({
    sessionId,
    institutionId: institution.id,
    onServed: () => {
      const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 1;
      onDone(mins, false);
    },
  });

  // ── Notification callbacks ───────────────────────────────────────────────
  const handleNearTurn = useCallback((spotsLeft: number) => {
    console.info(`[QueueLess] Near-turn fired: ${spotsLeft} spots left`);
  }, []);

  const handleTurnCalled = useCallback(() => {
    console.info("[QueueLess] Turn called notification fired");
  }, []);

  const { latestNearTurn, latestTurnCalled } = useNotifications({
    sessionId,
    yourNumber,
    peopleAhead,
    onNearTurn: handleNearTurn,
    onTurnCalled: handleTurnCalled,
  });

  // ── Derived state ────────────────────────────────────────────────────────
  const spotsAway = peopleAhead;
  const pct = Math.max(0, Math.min(100, 100 - (spotsAway / 15) * 100));

  const isServing = status === "serving";
  const isNext = spotsAway === 0 && status !== "served" && status !== "serving";
  const isTurn = status === "served" || status === "serving";
  const isAlmost =
    nearTurnNotified || !!latestNearTurn || (spotsAway <= 5 && spotsAway > 0);

  const showTurnCalled = !!(
    latestTurnCalled ||
    status === "served" ||
    status === "serving"
  );
  const showNearTurn =
    !!(
      nearTurnNotified ||
      latestNearTurn ||
      (spotsAway <= 5 && spotsAway > 0)
    ) && !showTurnCalled;

  useEffect(() => {
    if (showNearTurn || showTurnCalled || isServing) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showNearTurn, showTurnCalled, isServing]);

  useEffect(() => {
    if (error) showToast(`Could not update queue status: ${error}`);
  }, [error, showToast]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    if (!window.confirm("Cancel your spot in the queue?")) return;
    const mins = Math.round((Date.now() - joinedAt.getTime()) / 60000) || 0;
    onDone(mins, true);
  }, [joinedAt, onDone]);

  const handleShare = useCallback(() => {
    const txt = `I'm ${formatQueueNumber(yourNumber)} in the queue at ${institution.name}. Track with QueueLess!`;
    if (navigator.share) {
      navigator.share({ text: txt });
    } else {
      navigator.clipboard
        ?.writeText(txt)
        .then(() => alert("Copied to clipboard!"));
    }
  }, [yourNumber, institution.name]);

  const handleEnablePush = useCallback(async () => {
    setPushLoading(true);
    try {
      if (!("Notification" in window)) {
        showToast("Your browser does not support notifications.");
        return;
      }
      if (Notification.permission === "denied") {
        showToast(
          "Notifications are blocked. Please click the lock/bell icon in your address bar and allow notifications, then try again."
        );
        return;
      }
      const permission = await Promise.race([
        Notification.requestPermission(),
        new Promise<NotificationPermission>((resolve) =>
          setTimeout(() => resolve("denied"), 10000)
        ),
      ]);
      if (permission !== "granted") {
        showToast(
          "Notification permission was not granted. Please allow notifications in your browser settings and try again."
        );
        return;
      }
      const ok = await subscribeToPush(sessionId);
      setPushSubscribed(ok);
      if (ok) {
        setNotifPermission("granted");
        showToast(
          "Push notifications enabled! You'll be alerted when your turn is near. ✓",
          "success"
        );
      } else {
        showToast(
          "Notifications allowed but push setup failed. Try refreshing the page and enabling again."
        );
      }
    } catch (err) {
      console.error("[QueueLess Push] handleEnablePush error:", err);
      showToast("Something went wrong enabling notifications. Please try again.");
    } finally {
      setPushLoading(false);
    }
  }, [sessionId, showToast]);

  // ── Labels / styles ──────────────────────────────────────────────────────
  const awayLabel = isServing
    ? "Head to the counter now!"
    : isNext
    ? "Next up! Get ready."
    : isTurn
    ? "It's your turn!"
    : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away`;

  const statusColor = isServing
    ? "#f59e0b"
    : isTurn
    ? "#22c55e"
    : isAlmost || isNext
    ? "#22c55e"
    : "#6B82A8";

  const statusBadge = isServing
    ? "At Counter"
    : isTurn
    ? "Your Turn!"
    : isAlmost
    ? "Almost!"
    : "Waiting";

  const bannerAccent = (showTurnCalled || isServing)
    ? "#22c55e"
    : spotsAway <= 3
    ? "#f59e0b"
    : "#6366f1";

  const notifTitle = isServing
    ? "Head to the counter!"
    : showTurnCalled
    ? "It's your turn!"
    : spotsAway <= 3
    ? "Only 3 spots left!"
    : "5 spots left - head back soon!";

  const notifMessage = isServing
    ? `Queue ${formatQueueNumber(yourNumber)} - please go to the counter now!`
    : showTurnCalled
    ? latestTurnCalled?.message ??
      `Queue ${formatQueueNumber(yourNumber)} is now being served. Head to the counter now!`
    : spotsAway <= 3
    ? `You're ${formatQueueNumber(yourNumber)} with ${spotsAway} spot${
        spotsAway !== 1 ? "s" : ""
      } left. Head back immediately!`
    : latestNearTurn
    ? latestNearTurn.message
    : `You're ${formatQueueNumber(yourNumber)} - about 5 people ahead. Start making your way back.`;

  const showPushBanner = !pushSubscribed && notifPermission !== "granted";
  const pushUnsupported = !isPushSupported();

  return {
    // queue state
    currentServing,
    spotsAway,
    pct,
    status,
    queueLoading,
    isFlashing,
    // derived booleans
    isServing,
    isNext,
    isTurn,
    isAlmost,
    showTurnCalled,
    showNearTurn,
    // notification
    latestNearTurn,
    latestTurnCalled,
    notifTitle,
    notifMessage,
    // push
    pushSubscribed,
    pushLoading,
    showPushBanner,
    pushUnsupported,
    // labels
    awayLabel,
    statusColor,
    statusBadge,
    bannerAccent,
    // handlers
    handleCancel,
    handleShare,
    handleEnablePush,
    // toasts
    toasts,
    removeToast,
  };
}