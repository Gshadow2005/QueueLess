import { useRouter } from "./hooks/useRouter";
import LandingPage from "./pages/LandingPage";
import AppPage from "./pages/AppPage";

export default function App() {
  const { route, navigate } = useRouter();

  if (route === "/app") {
    return <AppPage onBack={() => navigate("/")} />;
  }

  return <LandingPage onLaunchApp={() => navigate("/app")} />;
}