import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JsonInputCard from "@/components/JsonInputCard";
import { FaqSection, AboutSection, Footer } from "@/components/FooterSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6">
        <HeroSection />
        <JsonInputCard />
        <FaqSection />
        <AboutSection />
      </main>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Footer />
      </div>
    </>
  );
}
