import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExpertiseDetail from './pages/ExpertiseDetail';
import ProjectDetail from './pages/ProjectDetail';
import ConsultationModal from './components/ConsultationModal';
import Footer from './components/Footer';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const [selectedService, setSelectedService] = useState('Artificial Grass Installation');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', location: 'Manama',
    timeline: 'Immediately', contactMethod: 'WhatsApp', message: ''
  });

  const triggerConsultation = (serviceName = '', customMessage = '') => {
    if (serviceName) setSelectedService(serviceName);
    if (customMessage) setFormData(prev => ({...prev, message: customMessage}));
    setIsConsultationOpen(true);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar 
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        triggerConsultation={triggerConsultation}
      />

      <Home 
        triggerConsultation={triggerConsultation}
        setSelectedExpertise={setSelectedExpertise}
        setSelectedProject={setSelectedProject}
      />

      <ExpertiseDetail 
        selectedExpertise={selectedExpertise}
        setSelectedExpertise={setSelectedExpertise}
        triggerConsultation={triggerConsultation}
      />

      <ProjectDetail 
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        triggerConsultation={triggerConsultation}
      />

      <ConsultationModal 
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        formData={formData}
        setFormData={setFormData}
      />

      <Footer />
    </div>
  );
}