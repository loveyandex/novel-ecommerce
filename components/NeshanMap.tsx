'use client';

import { useEffect, useRef } from 'react';
import loadNeshanMap from './loaders/neshan_map_loader';

interface NeshanMapProps {
  style?: React.CSSProperties;
  options?: {
    key?: string;
    maptype?: string;
    poi?: boolean;
    traffic?: boolean;
    center?: [number, number];
    zoom?: number;
  };
  onInit?: (L: any, map: any) => void;
}

export default function NeshanMap({ style, options, onInit }: NeshanMapProps) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const defaultStyle: React.CSSProperties = {
    width: 'inherit',
    height: '100%',
    margin: 0,
    padding: 0,
    background: '#eee',
  };

  const defaultOptions = {
    key: 'web.DQdth5W91qXg4C57n9kMwCPPVoWJXcfF827t1ob3',
    maptype: 'neshan',
    poi: true,
    traffic: false,
    center: [35.699739, 51.338097] as [number, number],
    zoom: 14,
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    loadNeshanMap({
      onLoad: () => {
        if (!mapEl.current || mapInstanceRef.current) return;

        if (!window.L || !window.L.Map) {
          console.error("Neshan Maps Error: window.L.Map is not available");
          return;
        }

        const mapInstance = new window.L.Map(mapEl.current, { ...defaultOptions, ...options });
        mapInstanceRef.current = mapInstance;

        console.log(mapInstance)

        if (onInit) onInit(window.L, mapInstance);
      },
      onError: () => {
        console.error("Neshan Maps Error: Failed to load Neshan Maps");
      },
    });

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [options, onInit]);

  return (
    <div ref={mapEl} style={{ ...defaultStyle, ...style }} />
  );
}