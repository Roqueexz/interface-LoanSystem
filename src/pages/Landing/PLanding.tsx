import LandingHeader from '../../components/Landing/LandingHeader';
import LandingFooter from '../../components/Landing/LandingFooter';
import Hero from '../../components/Landing/Hero';
import ProblemaSection from '../../components/Landing/ProblemaSection';
import PilaresSection from '../../components/Landing/PilaresSection';
import CaixaPessoalSection from '../../components/Landing/CaixaPessoalSection';
import ExperienciaSection from '../../components/Landing/ExperienciaSection';
import CtaFinalSection from '../../components/Landing/CtaFinalSection';

export default function PLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <ProblemaSection />
        <PilaresSection />
        <CaixaPessoalSection />
        <ExperienciaSection />
        <CtaFinalSection />
      </main>
      <LandingFooter />
    </div>
  );
}
