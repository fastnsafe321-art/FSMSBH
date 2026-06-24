import { ColorScheme, NavLink } from '../types';

/**
 * Brand Colors - Extracted from inline styles
 */
export const COLORS: ColorScheme = {
  primary: '#0083C9',    // Fast & Safe Blue
  accent: '#36B649',     // Green accent
  dark: '#030303',
  gray: '#1A1A1A',
  lightGray: '#F5F5F5',
};

/**
 * Main Navigation Links
 */
export const NAV_LINKS: NavLink[] = [
  { name: 'HOME', href: '#' },
  { name: 'HYBRID GRASS', href: '#hybridgrass' },
  { name: 'SUB-AIR TECH', href: '#sub-air-system' },
  { name: 'SERVICES', href: '#services' },
  { name: 'EXPERTISE', href: '#expertise' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'SAFETY', href: '#safety' },
  { name: 'CONTACT', href: '#contact' },
];

/**
 * Bahrain Locations for Consultation Form
 */
export const BAHRAIN_LOCATIONS = [
  'Manama',
  'Riffa',
  'Amwaj Islands',
  'Sitra',
  'Muharraq',
  'Saar / Janabiya',
  'Seef District',
  'Hamad Town / Isa Town',
  'Zallaq',
  'Hidd',
  'Other Region (Bahrain)'
];

/**
 * Service/Activity Categories for Consultation
 */
export const ACTIVITIES = [
  'Artificial Grass Installation',
  'Natural Grass Installation',
  'Fencing Works',
  'Building Construction',
  'Horse Walker Installation',
  'Swimming Pool Construction',
  'Other / Turnkey Project'
];

/**
 * Project Categories
 */
export const PROJECT_CATEGORIES = [
  'Professional Sports',
  'Athletic Facilities',
  'Turnkey Construction',
  'Sports Surface',
  'Specialized Construction',
  'Educational / Sports',
  'Aquatic Engineering',
];

/**
 * Consultation Contact Methods
 */
export const CONTACT_METHODS = ['WhatsApp', 'Phone Call', 'Email Channel'] as const;

/**
 * Image Compression Settings
 */
export const IMAGE_COMPRESSION = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.55,  // Optimized for 35KB average
  previewQuality: 0.85,
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  PROJECTS: 'fast_safe_projects',
  EXPERTISE: 'fast_safe_expertise',
} as const;

/**
 * Company Info
 */
export const COMPANY_INFO = {
  name: 'FAST & SAFE',
  fullName: 'Fast & Safe Maintenance Services',
  subtitle: 'CONSTRUCTION & ENGINEERING',
  founded: '2010',
  location: 'Sitra, Kingdom of Bahrain',
  phone: '+973 77912500',
  email: 'fastsafecontracting@gmail.com',
  yearsExperience: '16',
  repeatCustomerRate: '75%',
} as const;

/**
 * ISO Certifications
 */
export const ISO_CERTIFICATIONS = [
  { code: 'ISO 9001:2015', title: 'Quality Management', color: '#0083C9' },
  { code: 'ISO 14001:2015', title: 'Environmental Safeguards', color: '#36B649' },
  { code: 'ISO 45001:2018', title: 'Health & Safety', color: '#FFA500' },
] as const;

/**
 * Scroll threshold for navbar change (pixels)
 */
export const NAVBAR_SCROLL_THRESHOLD = 50;

/**
 * Animation timings
 */
export const ANIMATION_TIMING = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;
