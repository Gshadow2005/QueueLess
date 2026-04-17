import { useState, useEffect } from "react";

export type Route = "/" | "/queue";

export function useRouter() {
  const getRoute = (): Route => {
    const hash = window.location.hash;
    if (hash === "#/queue") return "/queue";
    return "/";
  };

  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: Route) => {
    window.location.hash = to === "/" ? "" : `#${to}`;
  };

  return { route, navigate };
}