/**
 * Image utility functions
 */

import { IMAGE_COMPRESSION } from '../constants';

/**
 * Resolve image paths for both local dev and production
 * Handles /src/assets/images/ → /assets/images/ conversion
 */
export const getImgUrl = (path: string | undefined): string => {
  if (!path) return '';
  const resolved = path.replace(/^\/src\/assets\/images\//, '/assets/images/');
  return encodeURI(resolved);
};

/**
 * Compress base64 image to reduce storage payload
 * @param base64Str - Base64 encoded image
 * @param maxWidth - Maximum width (default 800px)
 * @param maxHeight - Maximum height (default 600px)
 * @returns Promise<string> - Compressed base64 string
 */
export const compressImage = (
  base64Str: string,
  maxWidth = IMAGE_COMPRESSION.maxWidth,
  maxHeight = IMAGE_COMPRESSION.maxHeight
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate proper scaling
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Using optimized JPEG quality to minimize footprint
        resolve(canvas.toDataURL('image/jpeg', IMAGE_COMPRESSION.quality));
      } else {
        resolve(base64Str);
      }
    };
    
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

/**
 * Safe localStorage setter with quota and sandbox error handling
 * @param key - Storage key
 * @param value - Value to store
 * @returns boolean - Success indicator
 */
export const safeSetLocalStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    console.error("LocalStorage write failed:", e);
    
    const isQuotaExceeded = e instanceof DOMException && (
      e.code === 22 || 
      e.code === 1014 || 
      e.name === 'QuotaExceededError' || 
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      (e.message && e.message.toLowerCase().includes('quota')) ||
      (e.message && e.message.toLowerCase().includes('limit'))
    );
    
    if (isQuotaExceeded) {
      alert("Performance Alert: Your browser's offline storage (5MB LocalStorage limit) is currently full!\n\nThis photo has been added to your current view, but cannot be saved permanently. To save new uploaded images, please delete some older ones in the project galleries first.");
    } else {
      console.warn("Storage write restricted inside the iframe sandboxed preview. Images might not persist across refreshes.");
    }
    return false;
  }
};

/**
 * Safe localStorage getter with error handling
 * @param key - Storage key
 * @returns Parsed value or null
 */
export const safeGetLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn(`Failed to retrieve item from localStorage: ${key}`, e);
    return null;
  }
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return /^\+?[0-9\s\-()]{7,15}$/.test(phone.trim());
};

/**
 * Generate a unique consultation ticket
 */
export const generateConsultationTicket = (): string => {
  const randomTicket = Math.floor(1000 + Math.random() * 9000);
  return `FS-Q-${new Date().getFullYear()}-${randomTicket}`;
};
