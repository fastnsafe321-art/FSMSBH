import React, { useState, useRef, FormEvent } from 'react';
import { ChevronRight, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { serverTimestamp } from 'firebase/firestore';


//Modals
import ConsultationModal from './components/modals/ConsultationModal';
import ExpertiseDetailsModal from './components/modals/ExpertiseDetailsModal';
import ProjectDetailsModal from './components/modals/ProjectDetailsModal';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import JsonLd from './components/seo/JsonLd';

// Section Components
import AboutSection from './components/sections/AboutSection';
import ExpertiseSection from './components/sections/ExpertiseSection';
import ProjectsSection from './components/sections/ProjectsSection';

// Existing Showcase Components
import HeroCarousel from './components/HeroCarousel';
import HybridGrassShowcase from './components/HybridGrassShowcase';
import SubAirVentShowcase from './components/SubAirVentShowcase';
import PremiumPitchesTech from './components/PremiumPitchesTech';
import FencingShowcase from './components/FencingShowcase';
import NaturalGrassShowcase from './components/NaturalGrassShowcase';
import SitraMap from './components/SitraMap';

// Constants, Data, and Utils
import { COLORS, ACTIVITIES, BAHRAIN_LOCATIONS, PROJECT_CATEGORIES, STORAGE_KEYS, COMPANY_INFO } from './constants';
import { EXPERTISE } from './data/expertise';
import { PROJECTS } from './data/projects';
import {
  getImgUrl,
  compressImage,
  safeSetLocalStorage,
  safeGetLocalStorage,
  isValidPhoneNumber,
  generateConsultationTicket,
} from './utils';

// Hooks
import { useCamera } from './hooks';

// Types
import { Project, Expertise, ConsultationFormState } from './types';
import { writeConsultation, handleFirestoreError, OperationType } from './firebase';

/**
 * Main Application Component
 * Clean composition layer with minimal business logic
 * 
 * Architecture:
 * - Layout: Navbar, Footer
 * - Sections: Hero, Services, Projects, About, etc.
 * - Modals: Consultation, Project Details, Expertise Details
 * - State: Projects, Expertise, Consultation form
 */
export default function App() {
  // ===========================
  // UI State Management
  // ===========================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<Expertise | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // ===========================
  // Consultation Form State
  // ===========================
  const [selectedService, setSelectedService] = useState(ACTIVITIES[0]);
  const [formData, setFormData] = useState<ConsultationFormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: BAHRAIN_LOCATIONS[0],
    timeline: 'Immediately',
    contactMethod: 'WhatsApp',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [consultationRef, setConsultationRef] = useState('');
  const [attachedPhotos, setAttachedPhotos] = useState<Array<{ id: string; name: string; dataUrl: string }>>([]);

  // ===========================
  // Camera State
  // ===========================
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const {
    isCameraActive,
    setIsCameraActive,
    cameraStream,
    cameraDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    cameraError,
    setCameraError,
    startCamera,
    stopCamera,
  } = useCamera();

  // ===========================
  // Auto cleanup camera on modal close
  // ===========================
  React.useEffect(() => {
    if (!isConsultationOpen) {
      setIsCameraActive(false);
      setCameraError(null);
    }
  }, [isConsultationOpen]);

  React.useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraActive, cameraStream]);

  // ===========================
  // Camera Operations
  // ===========================
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, w, h);
      const rawUrl = canvas.toDataURL('image/jpeg', 0.85);
      const compressed = await compressImage(rawUrl, 960, 720);

      setAttachedPhotos(prev => [
        ...prev,
        {
          id: `snap-${Date.now()}-${Math.random()}`,
          name: `Snapshot_${attachedPhotos.length + 1}.jpg`,
          dataUrl: compressed
        }
      ]);
    } catch (err) {
      console.error('Snapshot capture failed:', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const elements: Array<{ id: string; name: string; dataUrl: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const dataUrlStr = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsDataURL(file);
        });

        const compressed = await compressImage(dataUrlStr, 960, 720);
        elements.push({
          id: `file-${Date.now()}-${i}-${Math.random()}`,
          name: file.name,
          dataUrl: compressed
        });
      } catch (err) {
        console.error('File processing error:', err);
      }
    }

    if (elements.length > 0) {
      setAttachedPhotos(prev => [...prev, ...elements]);
    }
    e.target.value = '';
  };

  const removePhoto = (id: string) => {
    setAttachedPhotos(prev => prev.filter(p => p.id !== id));
  };

  // ===========================
  // Form Operations
  // ===========================
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      location: BAHRAIN_LOCATIONS[0],
      timeline: 'Immediately',
      contactMethod: 'WhatsApp',
      message: '',
    });
    setFormErrors({});
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setConsultationRef('');
    setAttachedPhotos([]);
    setIsCameraActive(false);
    setCameraError(null);
  };

  const triggerConsultation = (serviceName = '', customMessage = '') => {
    resetForm();
    if (serviceName) {
      const foundMatch = ACTIVITIES.find(act =>
        act.toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(act.toLowerCase())
      );
      setSelectedService(foundMatch || ACTIVITIES[0]);
    } else {
      setSelectedService(ACTIVITIES[0]);
    }
    if (customMessage) {
      setFormData(prev => ({...prev, message: customMessage}));
    }
    setIsConsultationOpen(true);
    setIsMenuOpen(false);
  };

  const handleSubmitConsultation = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) errors.name = 'Full name is required.';
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!isValidPhoneNumber(formData.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const ticketCode = generateConsultationTicket();

    try {
      const payload: Record<string, any> = {
        name: formData.name?.trim(),
        phone: formData.phone?.trim(),
        location: formData.location,
        timeline: formData.timeline,
        contactMethod: formData.contactMethod,
        service: selectedService,
        status: 'pending',
        ticket: ticketCode,
        createdAt: serverTimestamp(),
      };

      if (formData.email?.trim()) payload.email = formData.email.trim();
      if (formData.company?.trim()) payload.company = formData.company.trim();
      if (formData.message?.trim()) payload.message = formData.message.trim();
      if (attachedPhotos.length > 0) payload.photos = attachedPhotos.map(p => p.dataUrl);

      await writeConsultation(payload);

      setConsultationRef(ticketCode);
      setSubmitSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'consultations');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================
  // Render
  // ===========================
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#0083C9] selection:text-white">
      <JsonLd />
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onConsultation={() => triggerConsultation()}
      />

      <main>
      {/* Hero Section */}
      <HeroCarousel
        getImgUrl={getImgUrl}
        triggerConsultation={triggerConsultation}
      />

      {/* Hybrid Grass Section */}
      <HybridGrassShowcase getImgUrl={getImgUrl} />

      {/* Sub-Air Vent Section */}
      <SubAirVentShowcase getImgUrl={getImgUrl} triggerConsultation={triggerConsultation} />

      {/* About Section */}
      <AboutSection />

      {/* Premium Pitches Tech */}
      <div id="services">
        <PremiumPitchesTech getImgUrl={getImgUrl} />
      </div>

      {/* Expertise Section */}
      <ExpertiseSection
        expertiseList={EXPERTISE}
        onSelectExpertise={setSelectedExpertise}
      />

      {/* Projects Section */}
      <ProjectsSection
        projectsList={PROJECTS}
        onSelectProject={setSelectedProject}
      />

      {/* Safety & Quality Section */}
      <section id="safety" className="bg-[#0083C9] text-white py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <p className="text-sm font-bold tracking-[0.3em] opacity-80 mb-4 uppercase">
                Commitment to Standards
              </p>
              <h2 className="text-4xl font-bold mb-8">Quality & Safety in Project Delivery</h2>
              <p className="text-white/80 leading-relaxed mb-8">
                We understand that safety, quality, and environmental compliance are deeply interconnected.
                Our fully audited ISO certifications mandate absolute rigour across our entire operational chain.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Certified Scaffolding Dept.',
                  'Advanced Laser Metrology Tools',
                  'Daily Site Safety Briefings',
                  '3rd Party Audit Inspections'
                ].map(point => (
                  <div key={point} className="flex items-center gap-3 bg-white/15 p-4 rounded-xl">
                    <ChevronRight size={16} />
                    <span className="text-sm font-bold">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative w-full">
              <div className="bg-white/10 p-12 rounded-3xl backdrop-blur-md border border-white/20">
                <span className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold mb-2 block">
                  Enterprise Quality Audit
                </span>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-2xl font-black italic text-[#0083C9] bg-white w-fit px-4 py-1 rounded">
                    ISO 9001:2015
                  </h3>
                  <span className="text-xs font-bold text-white/95">Certified Policy</span>
                </div>
                <p className="text-lg italic leading-relaxed mb-8">
                  "Our drive for improvement stems from our uncompromising commitment to global quality standards."
                </p>
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-2">
                    {['Q', 'E', 'S'].map(letter => (
                      <span
                        key={letter}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border border-[#0083C9]"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-white/90">
                    Integrated Quality, Environmental & Safety Control
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sitra Map */}
      <SitraMap />
      </main>

      <Footer />

      {/* Floating FAB */}
      <AnimatePresence>
        {/* FAB would go here */}
      </AnimatePresence>
      <ExpertiseDetailsModal
        expertise={selectedExpertise}
        onClose={() => setSelectedExpertise(null)}
      />
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={(title) => triggerConsultation('', `Inquiry regarding a project similar to: ${title}`)}
      />
      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        setIsOpen={setIsConsultationOpen}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}