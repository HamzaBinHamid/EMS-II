import Navbar from "@/components/Navbar";
import Intro from "@/components/Intro";
import ContentSection from "@/components/ContentSection";
import { Footer } from "@/components";

export default function Home() {
  return (
    <>
      <Navbar />
      <div>
        <Intro />
        <ContentSection />
        <Footer />
      </div>
    </>
  );
}
