import { DemoRoot } from '@/components/demo/demo-root';
import { CtaBanner } from '@/components/landing/cta-banner';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Navbar } from '@/components/landing/navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <CtaBanner />
      </main>
      <Footer />
      <DemoRoot />
    </>
  );
}
