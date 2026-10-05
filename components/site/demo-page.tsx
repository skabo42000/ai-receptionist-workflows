import { LazyBookingDialog } from "@/components/booking/lazy-booking-dialog";
import { ChatProvider } from "@/components/chat/chat-provider";
import { CustomizeSheet } from "@/components/customize/customize-sheet";
import { DemoProvider } from "@/components/providers/demo-provider";
import { VoicePanel } from "@/components/voice/voice-panel";
import { VoiceProvider } from "@/components/voice/voice-provider";
import { VoiceTeaser } from "@/components/voice/voice-teaser";
import { type Brand, accentCss } from "@/lib/brand";
import { About } from "./about";
import { DemoRibbon } from "./demo-ribbon";
import { Experience } from "./experience";
import { Faq } from "./faq";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { MobileActionBar } from "./mobile-action-bar";
import { OpenedBeacon } from "./opened-beacon";
import { QuoteSection } from "./quote-section";
import { Reviews } from "./reviews";
import { Services } from "./services";
import { SynqBand } from "./synq-band";
import { VoiceSection } from "./voice-section";

/** The whole demo page. Used by the main demo (/) and by prospect links (/d/[slug]), which look the
 *  same and only add the "opened" alert. */
export function DemoPage({ brand, prospectSlug = null }: { brand: Brand; prospectSlug?: string | null }) {
  return (
    <DemoProvider initialBrand={brand} prospect={prospectSlug}>
      <VoiceProvider>
        <ChatProvider>
        <style>{accentCss(brand.accent)}</style>
        <DemoRibbon />
        <Header />
        <main>
          <Hero />
          <Services />
          <Experience />
          <VoiceSection />
          <QuoteSection />
          <About />
          <Reviews />
          <Faq />
          <SynqBand />
        </main>
        <Footer />
        <MobileActionBar />
        <VoicePanel />
        <VoiceTeaser />
        <LazyBookingDialog />
        <CustomizeSheet />
        {prospectSlug && <OpenedBeacon slug={prospectSlug} />}
        </ChatProvider>
      </VoiceProvider>
    </DemoProvider>
  );
}
