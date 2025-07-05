'use client';
import * as L from 'leaflet';
import { useEffect, useRef, memo } from 'react';
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
  onInit?: (l: typeof L, map: L.Map) => void;
}

function NeshanMap({ style, options, onInit }: NeshanMapProps) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mapCenterRef = useRef<[number, number]>([35.699739, 51.338097]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const defaultOptions = {
      key: 'web.DQdth5W91qXg4C57n9kMwCPPVoWJXcfF827t1ob3',
      maptype: 'neshan',
      poi: true,
      traffic: false,
      center: mapCenterRef.current,
      zoom: 14,
    };

    loadNeshanMap({
      onLoad: () => {
        if (!mapEl.current || mapInstanceRef.current) return;

        if (!window.L || !window.L.Map) {
          console.error("Neshan Maps Error: window.L.Map is not available");
          return;
        }

        const mapInstance = new window.L.Map(mapEl.current, { ...defaultOptions, ...options });
        mapInstanceRef.current = mapInstance;

        // Update mapCenterRef with the initial center
        const initialCenter = mapInstance.getCenter();
        mapCenterRef.current = [initialCenter.lat, initialCenter.lng];

        // Listen for moveend to update mapCenterRef on any movement (drag or zoom)
        mapInstance.on('moveend', () => {
          const center = mapInstance.getCenter();
          mapCenterRef.current = [center.lat, center.lng];
        });

        if (onInit) onInit(window.L, mapInstance);
      },
      onError: () => {
        console.error("Neshan Maps Error: Failed to load Neshan Maps");
      },
    });

    return () => {
      if (mapInstanceRef.current) {
        try {
          // Preserve the current center before removing the map
          const currentCenter = mapInstanceRef.current.getCenter();
          mapCenterRef.current = [currentCenter.lat, currentCenter.lng];
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [options, onInit]); // No need for defaultOptions in dependencies now

  const defaultStyle: React.CSSProperties = {
    width: 'inherit',
    height: '100%',
    margin: 0,
    padding: 0,
    background: '#eee',
  };

  return (
    <div ref={mapEl} style={{ ...defaultStyle, ...style }} />
  );
}

export default memo(NeshanMap);