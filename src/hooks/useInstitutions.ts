import { useReducer, useEffect } from "react";
import { fetchInstitutions, type APIInstitution } from "../api/queue";
import type { Institution } from "../data/institutions";

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
  institutions: Institution[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Institution[] }
  | { type: "FETCH_ERROR"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { institutions: [], loading: true, error: null };
    case "FETCH_SUCCESS":
      return { institutions: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
  }
}

const initialState: State = {
  institutions: [],
  loading: true,
  error: null,
};

interface UseInstitutionsResult {
  institutions: Institution[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInstitutions(): UseInstitutionsResult {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tick, setTick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "FETCH_START" });

    fetchInstitutions()
      .then((data) => {
        if (!cancelled)
          dispatch({ type: "FETCH_SUCCESS", payload: data.map(mapAPIInstitution) });
      })
      .catch((err: Error) => {
        if (!cancelled)
          dispatch({ type: "FETCH_ERROR", payload: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { ...state, refetch: setTick };
}