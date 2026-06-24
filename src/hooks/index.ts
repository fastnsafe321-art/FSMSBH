import { useState, useEffect } from 'react';
import { NAVBAR_SCROLL_THRESHOLD } from '../constants';

/**
 * Hook to track scroll position and trigger navbar changes
 */
export const useScroll = (threshold = NAVBAR_SCROLL_THRESHOLD): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

/**
 * Hook for safe localStorage operations with type safety
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Failed to read from localStorage: ${key}`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Failed to write to localStorage: ${key}`, error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * Hook for managing camera stream lifecycle
 * Handles permissions, device enumeration, and cleanup
 */
export const useCamera = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);

  /**
   * Start camera stream with optional device selection
   */
  const startCamera = async (deviceId?: string) => {
    try {
      setCameraError(null);

      // Stop existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: { ideal: 'environment' } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsCameraActive(true);

      // Enumerate available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setCameraDevices(videoInputs);

      if (!deviceId && videoInputs.length > 0) {
        const activeTrack = stream.getVideoTracks()[0];
        const activeSettings = activeTrack?.getSettings();
        setSelectedDeviceId(activeSettings?.deviceId || videoInputs[0].deviceId);
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      let errMsg = 'Could not access camera. Please confirm site permissions.';
      
      if (err.name === 'NotAllowedError') {
        errMsg = 'Camera permission was denied in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errMsg = 'No operational camera device was detected.';
      }
      
      setCameraError(errMsg);
      setIsCameraActive(false);
    }
  };

  /**
   * Stop camera stream
   */
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /**
   * Auto cleanup when modal closes
   */
  useEffect(() => {
    if (!isCameraActive && cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [isCameraActive, cameraStream]);

  return {
    isCameraActive,
    setIsCameraActive,
    cameraStream,
    setCameraStream,
    cameraDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    cameraError,
    setCameraError,
    startCamera,
    stopCamera,
  };
};
