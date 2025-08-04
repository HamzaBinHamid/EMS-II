import { Navbar } from "@/components";
import { Intro } from "@/components";
import { ContentSection } from "@/components";
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
