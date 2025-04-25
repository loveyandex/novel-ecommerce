'use client';

import { useEffect, useRef } from 'react';
import NeshanMap from './NeshanMap';

interface SimpleMapProps {
  currentCenter?: { lat: number; lng: number };
  onMouseRelease?: (map: any) => void;
}

export default function SimpleMap({ currentCenter, onMouseRelease }: SimpleMapProps) {
  const LRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (mapRef.current && onMouseRelease) {
        onMouseRelease(mapRef.current);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMouseRelease]);

  return (
    <NeshanMap
      options={currentCenter ? { center: [currentCenter.lat, currentCenter.lng] } : undefined}
      onInit={(L: any, map: any) => {
        LRef.current = L;
        mapRef.current = map;

        map.on('dragstart', () => {
          // No action needed on dragstart
        });

        map.on('dragend', () => {
          if (onMouseRelease) {
            onMouseRelease(map);
          }
        });
      }}
    />
  );
}