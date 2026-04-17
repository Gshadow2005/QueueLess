import Navbar from "../components/common/Navbar";
import HeroSection from "../components/LandingPage/HeroSection";
import HowItWorks from "../components/LandingPage/HowItWorks";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import ScenarioSection from "../components/LandingPage/ScenarioSection";
import SectorsSection from "../components/LandingPage/SectorsSection";
import CtaSection from "../components/LandingPage/CtaSection";
import Footer from "../components/common/Footer";
import BackToTop from "../components/common/BackToTop";

interface LandingPageProps {
  onLaunchApp: () => void;
}
 
export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ color: "var(--navy)" }}>
      <Navbar onLaunchApp={onLaunchApp} />
      <HeroSection onLaunchApp={onLaunchApp} />
      <HowItWorks />
      <FeaturesSection />
      <ScenarioSection />
      <SectorsSection />
      <CtaSection onLaunchApp={onLaunchApp} />
      <Footer />
      <BackToTop />
    </div>
  );
}