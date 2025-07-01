import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { TrustIndicators } from '@/components/trust-indicators';
import { RecentListings } from '@/components/recent-listings';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <HowItWorks />
      <TrustIndicators />
      <RecentListings />
      <Footer />
    </div>
  );
}