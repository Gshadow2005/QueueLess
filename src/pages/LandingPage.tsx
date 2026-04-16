import Navbar from "../components/common/Navbar";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturesSection from "../components/FeaturesSection";
import ScenarioSection from "../components/ScenarioSection";
import SectorsSection from "../components/SectorsSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/common/Footer";
import BackToTop from "../components/common/BackToTop";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ color: "var(--navy)" }}>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <ScenarioSection />
      <SectorsSection />
      <CtaSection />
      <Footer />
      <BackToTop />
    </div>
  );
}