import HeroCarousel from '../components/HeroCarousel';
import AboutSection from '../components/AboutSection';
import PremiumPitchesTech from '../components/PremiumPitchesTech';
import ExpertiseGrid from '../components/ExpertiseGrid';
import ProjectsGrid from '../components/ProjectsGrid';
import SafetySection from '../components/SafetySection';
import SitraMap from '../components/SitraMap';

const getImgUrl = (path: string | undefined): string => {
  if (!path) return '';
  return path.replace(/^\/src\/assets\/images\//, '/assets/images/');
};

interface Props {
  triggerConsultation: (service?: string, message?: string) => void;
  setSelectedExpertise: (exp: any) => void;
  setSelectedProject: (proj: any) => void;
}

export default function Home({ triggerConsultation, setSelectedExpertise, setSelectedProject }: Props) {
  return (
    <>
      <HeroCarousel getImgUrl={getImgUrl} triggerConsultation={triggerConsultation} />
      <AboutSection />
      <PremiumPitchesTech getImgUrl={getImgUrl} />
      <ExpertiseGrid getImgUrl={getImgUrl} setSelectedExpertise={setSelectedExpertise} />
      <ProjectsGrid getImgUrl={getImgUrl} setSelectedProject={setSelectedProject} />
      <SafetySection />
      <SitraMap />
    </>
  );
}