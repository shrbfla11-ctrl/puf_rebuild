import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Cta, Features, HowItWorks, ResultPreview, Trust } from "@/components/landing/Sections";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { getUser } from "@/lib/auth/user";

// 랜딩 페이지 (주소: /)
export default async function Home() {
  const user = await getUser();
  return (
    <>
      <Nav user={user} />
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
