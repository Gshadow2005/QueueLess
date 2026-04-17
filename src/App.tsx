import { useRouter } from "./hooks/useRouter";
import { Analytics } from "@vercel/analytics/react"
import LandingPage from "./pages/LandingPage";
import AppPage from "./pages/AppPage";

export default function App() {
  const { route, navigate } = useRouter();

  if (route === "/queue") {
    return (
      <>
        <AppPage onBack={() => navigate("/")} />
        <Analytics />
      </>
    );
  }

  return (
    <>
      <LandingPage onLaunchApp={() => navigate("/queue")} />
      <Analytics />
    </>
  );
}
