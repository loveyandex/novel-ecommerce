'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SimpleMap from './SimpleMap';

interface ShippingAddress {
  lat: number;
  lng: number;
  address: string;
  short: string;
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [mapLoc, setMapLoc] = useState<{ lat: number; lng: number } | undefined>();
  const router = useRouter();

  const handleSave = useCallback(() => {
    if (!mapLoc) return;

    const headers = new Headers();
    headers.append('Api-Key', 'service.Ornq0Gg6rHELQm9QVonknQskY8C6HKfFcuxXQj9M');

    fetch(`https://api.neshan.org/v4/reverse?lat=${mapLoc.lat}&lng=${mapLoc.lng}`, {
      method: 'GET',
      headers,
    })
      .then(response => response.json())
      .then(result => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('addr', JSON.stringify({
            defaultAddr: {
              latlng: mapLoc,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
      <div className="bg-surface-01 rounded-lg shadow-2xl overflow-hidden max-w-[450px] w-full h-[80vh] flex flex-col" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="w-full z-[1000] p-4 bg-surface-01 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onClose} className="text-neutral-700 hover:text-primary-500 transition-colors">
                <svg style={{ width: 24, height: 24, fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
              <span className="ml-4 text-neutral-700 text-sm font-semibold">جستجو محله</span>
            </div>
          </div>
          <p className="text-base font-semibold text-neutral-700 mt-2">مکان دقیق دریافت سفارش را روی نقشه انتخاب کنید.</p>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <SimpleMap
            onMouseRelease={(map) => {
              setMapLoc(map.getCenter());
            }}
          />
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!mapLoc}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] h-12 bg-secondary-500 text-white rounded-lg font-semibold hover:bg-secondary-300 disabled:bg-neutral-200 disabled:cursor-not-allowed transition-all duration-200"
          >
            ثبت آدرس
          </button>
        </div>
      </div>
    </div>
  );
}