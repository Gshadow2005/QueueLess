import { useEffect, useState } from "react";
import { type Institution } from "../types/institution";
import { useInstitution } from "./useInstitutions";
import { useToast } from "./useToast";

interface UseEnterQueueStateProps {
  institution: Institution;
  onSubmit: (queueNumber: number) => void;
  joinError: string | null;
}

export function useEnterQueueState({
  institution: initialInstitution,
  onSubmit,
  joinError,
}: UseEnterQueueStateProps) {
  const [queueNumberInput, setQueueNumberInput] = useState("");
  const [inputError, setInputError] = useState("");
  const { toasts, showToast, removeToast } = useToast();

  const {
    institution: liveInstitution,
    loading: refreshing,
    error: refreshError,
    refetch,
  } = useInstitution(initialInstitution.id);

  // Auto-refresh every 5 seconds silently
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const institution = liveInstitution ?? initialInstitution;
  const showSkeleton = refreshing && liveInstitution == null;

  const parsedNumber = parseInt(queueNumberInput, 10);
  const isValid = !isNaN(parsedNumber) && parsedNumber > 0;

  const spotsAway = isValid ? Math.max(0, parsedNumber - institution.serving - 1) : 0;
  const estWait = spotsAway * institution.waitPer;

  const handleSubmit = () => {
    if (!isValid) {
      setInputError("Please enter a valid queue number from your physical ticket.");
      return;
    }
    if (parsedNumber <= institution.serving) {
      setInputError("This queue number has already been served. Please check your ticket.");
      return;
    }
    setInputError("");
    onSubmit(parsedNumber);
  };

  useEffect(() => {
    if (joinError) showToast(joinError);
  }, [joinError, showToast]);

  useEffect(() => {
    if (refreshError) showToast("Could not refresh queue data. Showing last known values.");
  }, [refreshError, showToast]);

  return {
    // live institution data
    institution,
    showSkeleton,
    // input state
    queueNumberInput,
    setQueueNumberInput,
    inputError,
    setInputError,
    // derived
    isValid,
    spotsAway,
    estWait,
    // handler
    handleSubmit,
    // toasts
    toasts,
    removeToast,
  };
}