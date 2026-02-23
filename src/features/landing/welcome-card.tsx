import { CTA } from "./cta";
import { Features } from "./features";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Navbar } from "./navbar";
import { Pricing } from "./pricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-r from-white to-stone-50 dark:from-stone-950 dark:to-stone-900 overflow-auto">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}