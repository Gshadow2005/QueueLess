import { useReducer, useEffect, useCallback } from "react";
import { fetchInstitutions, fetchInstitution, type APIInstitution } from "../api/queue";
import type { Institution } from "../types/institution";

function mapAPIInstitution(api: APIInstitution): Institution {
  const typeMap: Record<string, Institution["type"]> = {
    bank: "bank",
    government: "government",
    utility: "utility",
    other: "government",
  };

  const statusMap: Record<string, Institution["status"]> = {
    open: "open",
    closed: "closed",
    paused: "busy",
  };

  return {
    id: api.id,
    name: api.name,
    type: typeMap[api.institution_type] ?? "government",
    address: api.address,
    status: api.is_available_for_queue
      ? statusMap[api.status] ?? "open"
      : api.status === "closed"
      ? "closed"
      : "busy",
    serving: api.current_serving_number,
    inQueue: api.queue_waiting_count,
    waitPer: 3,
  };
}

interface State {
  institution: Institution | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Institution }
  | { type: "FETCH_ERROR"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { institution: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
  }
}

export function useInstitution(id: number | null) {
  const [state, dispatch] = useReducer(reducer, {
    institution: null,
    loading: false,
    error: null,
  });

  const [tick, setTick] = useReducer((n: number) => n + 1, 0);

  const refetch = useCallback(() => setTick(), []);

  useEffect(() => {
    if (id === null) return;
    let cancelled = false;

    dispatch({ type: "FETCH_START" });

    fetchInstitution(id)
      .then((data) => {
        if (!cancelled)
          dispatch({ type: "FETCH_SUCCESS", payload: mapAPIInstitution(data) });
      })
      .catch((err: Error) => {
        if (!cancelled)
          dispatch({ type: "FETCH_ERROR", payload: err.message });
      });

    return () => { cancelled = true; };
  }, [id, tick]);

  return { ...state, refetch };
}

interface InstitutionsState {
  institutions: Institution[];
  loading: boolean;
  error: string | null;
}

type InstitutionsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Institution[] }
  | { type: "FETCH_ERROR"; payload: string };

function institutionsReducer(state: InstitutionsState, action: InstitutionsAction): InstitutionsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { institutions: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
  }
}

export function useInstitutions() {
  const [state, dispatch] = useReducer(institutionsReducer, {
    institutions: [],
    loading: true,
    error: null,
  });

  const [tick, setTick] = useReducer((n: number) => n + 1, 0);

  const refetch = useCallback(() => setTick(), []);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "FETCH_START" });

    fetchInstitutions()
      .then((data) => {
        if (!cancelled) {
          dispatch({ type: "FETCH_SUCCESS", payload: data.map(mapAPIInstitution) });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { ...state, refetch };
}
