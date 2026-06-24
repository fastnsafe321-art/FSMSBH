// Core domain types for Fast & Safe Construction
import { LucideIcon } from 'lucide-react';

/**
 * Project Portfolio Entry
 * Represents a completed construction/engineering project
 */
export interface Project {
  id: number;
  title: string;
  category: string;
  desc: string;
  image: string;
  client: string;
  year: string;
  details: string;
  gallery: string[];
}

/**
 * Expertise Service Category
 * Defines a service area with features, installation steps, and gallery
 */
export interface Expertise {
  name: string;
  icon: LucideIcon;
  image: string;
  desc: string;
  detailedDesc: string;
  features: string[];
  installationSteps?: InstallationStep[];
  caseStudies?: CaseStudy[];
  gallery: string[];
}

/**
 * Installation step for a service
 * Used in detailed process breakdowns
 */
export interface InstallationStep {
  step: string;
  title: string;
  desc: string;
  image: string;
}

/**
 * Case study for a service
 * Real-world project examples
 */
export interface CaseStudy {
  title: string;
  desc?: string;
  result: string;
  image?: string;
}

/**
 * Consultation form submission
 */
export interface ConsultationForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  timeline: string;
  contactMethod: 'WhatsApp' | 'Phone Call' | 'Email Channel';
  message: string;
  service: string;
}

/**
 * Attached photo for consultation
 */
export interface AttachedPhoto {
  id: string;
  name: string;
  dataUrl: string;
}

/**
 * Navigation link
 */
export interface NavLink {
  name: string;
  href: string;
}

/**
 * Color palette
 */
export interface ColorScheme {
  primary: string;
  accent: string;
  dark: string;
  gray: string;
  lightGray: string;
}
