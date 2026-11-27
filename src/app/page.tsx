import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Cta, Features, HowItWorks, ResultPreview, Trust } from "@/components/landing/Sections";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

// 랜딩 페이지 (주소: /)
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <ResultPreview />
        <Features />
        <Trust />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
