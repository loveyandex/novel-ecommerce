'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

interface ShippingAddress {
  lat: number;
  lng: number;
  address: string;
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: ShippingAddress) => void;
}

// Define DynamicMapProps for TypeScript
interface DynamicMapProps {
  position: [number, number];
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}

// Dynamically import the map component with SSR disabled and typed props
const DynamicMap = dynamic<DynamicMapProps>(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-neutral-700 rounded-lg">
      <div className="animate-pulse rounded-full h-8 w-8 bg-primary-500/50"></div>
    </div>
  ),
});

export default function MapModal({ isOpen, onClose, onSave }: MapModalProps) {
  const [position, setPosition] = useState<[number, number]>([35.6892, 51.3890]); // Default: Tehran
  const [address, setAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const hasCheckedStorage = useRef(false);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || hasCheckedStorage.current) return;

    // Mark storage as checked to prevent multiple checks
    hasCheckedStorage.current = true;

    // Check for existing shippingAddress (client-side only)
    try {
      const storedAddress = localStorage.getItem('shippingAddress');
      if (storedAddress) {
        const parsedAddress = JSON.parse(storedAddress) as ShippingAddress;
        if (parsedAddress.lat && parsedAddress.lng && parsedAddress.address) {
          onSave(parsedAddress);
        }
      }
    } catch (error) {
      console.error('Failed to parse shippingAddress:', error);
    }
  }, [isOpen, onSave]);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      // Placeholder for Nominatim API (uncomment and configure for production)
      /*
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fa`,
        { headers: { 'User-Agent': 'NovelEcommerceApp' } }
      );
      const data = await response.json();
      setAddress(data.display_name || `آدرس: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      */
      // Mock address
      setAddress(`آدرس نمونه: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (error) {
      console.error('Geocoding failed:', error);
      setAddress('خطا در دریافت آدرس');
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    setPosition([latlng.lat, latlng.lng]);
    fetchAddress(latlng.lat, latlng.lng);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6 transition-all duration-300">
      <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-5xl h-[85vh] sm:h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            انتخاب آدرس
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors duration-200"
            aria-label="بستن"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 rounded-lg overflow-hidden relative">
          <DynamicMap position={position} onMapClick={handleMapClick} />
          {isGeocoding && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="animate-pulse rounded-full h-8 w-8 bg-primary-500/50"></div>
            </div>
          )}
        </div>

        {/* Address Input */}
        <div className="mt-6">
          <input
            type="text"
            value={address}
            readOnly
            className="w-full h-14 px-4 bg-neutral-700 text-white rounded-lg shadow-inner focus:outline-none"
            placeholder="آدرس انتخاب‌شده"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={() => onSave({ lat: position[0], lng: position[1], address })}
          disabled={isGeocoding || !address}
          className="mt-6 w-full bg-primary-500 text-white h-14 rounded-lg font-semibold hover:bg-primary-600 disabled:bg-neutral-600 disabled:cursor-not-allowed transition-all duration-200"
        >
          ذخیره آدرس
        </button>
      </div>
    </div>
  );
}