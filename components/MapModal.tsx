'use client';
import * as L from 'leaflet';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SimpleMap from './SimpleMap';
import Image from 'next/image';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [mapLoc, setMapLoc] = useState<{ lat: number; lng: number } | undefined>();
  const [neighborhood, setNeighborhood] = useState<string>('ونک');
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedRef = useRef(false);
  const mapCenterRef = useRef<{ lat: number; lng: number } | undefined>(undefined);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(async () => {
      const headers = new Headers();
      headers.append('Api-Key', 'service.Ornq0Gg6rHELQm9QVonknQskY8C6HKfFcuxXQj9M');

      try {
        const response = await fetch(`https://api.neshan.org/v4/reverse?lat=${lat}&lng=${lng}`, {
          method: 'GET',
          headers,
        });
        const result = await response.json();
        if (result.status === 'OK') {
          setNeighborhood(result.neighbourhood || 'محله نامشخص');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setNeighborhood('خطا در دریافت محله');
      } finally {
        hasFetchedRef.current = false;
      }
    }, 300);
  }, []);

  const handleMouseRelease = useCallback((map: L.Map) => {
    const center = map.getCenter();
    const prevCenter = mapCenterRef.current;

    // Update mapCenterRef without causing a re-render
    mapCenterRef.current = { lat: center.lat, lng: center.lng };

    // Only update mapLoc and fetch address if the center has significantly changed
    if (
      !prevCenter ||
      Math.abs(prevCenter.lat - center.lat) > 0.00001 ||
      Math.abs(prevCenter.lng - center.lng) > 0.00001
    ) {
      setMapLoc(mapCenterRef.current);
      fetchAddress(center.lat, center.lng);
    }
  }, [fetchAddress]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          // Update the map's center to the user's location using setView
          mapInstanceRef.current.setView([latitude, longitude], 14);
          // Update mapCenterRef and fetch address, same as handleMouseRelease
          mapCenterRef.current = { lat: latitude, lng: longitude };
          setMapLoc(mapCenterRef.current);
          fetchAddress(latitude, longitude);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('خطا در دریافت موقعیت مکانی: لطفاً مجوز دسترسی به موقعیت را فعال کنید یا دوباره تلاش کنید.');
      }
    );
  }, [fetchAddress]);

  const handleSave = useCallback(() => {
    const currentLoc = mapCenterRef.current || mapLoc;
    if (!currentLoc) return;

    const headers = new Headers();
    headers.append('Api-Key', 'service.Ornq0Gg6rHELQm9QVonknQskY8C6HKfFcuxXQj9M');

    fetch(`https://api.neshan.org/v4/reverse?lat=${currentLoc.lat}&lng=${currentLoc.lng}`, {
      method: 'GET',
      headers,
    })
      .then(response => response.json())
      .then(result => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('addr', JSON.stringify({
            defaultAddr: {
              latlng: currentLoc,
              addressAddress: result.formatted_address,
              short: `${result.neighbourhood}, ${result.route_name}`,
            },
          }));
        }
        onClose();
        router.push('/shop');
      })
      .catch(error => console.error('Fetch error:', error));
  }, [mapLoc, onClose, router]);

  useEffect(() => {
    if (!isOpen) {
      hasFetchedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-[1000] flex items-center justify-center">
      <div className={`bg-white max-w-[512px] w-full h-[90vh] max-h-[95%] flex flex-col rounded-t-lg overflow-hidden hide-scrollbar ${isVisible ? 'animate-[var(--animation-slide-up)]' : 'animate-[var(--animation-slide-down)]'}`}>
        {/* Header */}
        <div className="w-full p-5 bg-white z-[10] flex justify-between items-center">
          <p className="text-neutral-900 font-bold text-[15px] leading-[25px]">انتخاب از روی نقشه</p>
          <button onClick={onClose} className="bg-neutral-100 rounded-full p-1 cursor-pointer">
            <svg className="w-6 h-6 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <label className="bg-neutral-100 flex items-center mx-5 my-4 rounded-md h-12 cursor-pointer hover:ring-1 ring-secondary-500 transition-all">
          <svg className="w-6 h-6 text-neutral-500 mx-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            placeholder="جستجوی آدرس، محله یا خیابان"
            readOnly
            className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 text-[15px] leading-[25px] font-bold cursor-pointer focus:outline-none"
          />
        </label>

        {/* Map */}
        <div className="flex-1 relative">
          <SimpleMap
            onMouseRelease={handleMouseRelease}
            setMapInstance={(map) => { mapInstanceRef.current = map; }}
          />
          {/* Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none w-6 h-9">
            <Image
              src="/mapPinLocation.svg"
              alt="Marker"
              width={24}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          {/* My Location Button */}
          <div className="absolute bottom-20 right-5 z-[9999]">
            <button
              onClick={handleGetLocation}
              className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-shadow duration-200"
              title="موقعیت من"
            >
              <svg className="w-6 h-6 text-secondary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm9-2a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9zm-2 0a7 7 0 0 0-7-7 7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7zM12 0a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1zm0 19a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zM0 12a1 1 0 0 1 1-1h3a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1zm19 0a1 1 0 0 1 1-1h3a1 1 0 0 1 0 2h-3a1 1 0 0 1-1-1z" />
              </svg>
            </button>
          </div>
          {/* Save Button */}
          <div className="absolute bottom-6 left-5 right-5 z-[9999]">
            <button
              onClick={handleSave}
              disabled={!mapLoc && !mapCenterRef.current}
              className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-md bg-secondary-500 text-white font-bold text-[15px] leading-[25px] disabled:bg-neutral-200 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="truncate">تایید موقعیت مکانی: {neighborhood}</span>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}