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
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseUp = () => {
      if (mapRef.current && onMouseRelease && isDraggingRef.current) {
        onMouseRelease(mapRef.current);
        isDraggingRef.current = false; // Reset drag flag
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
          isDraggingRef.current = true; // Set drag flag when dragging starts
        });

        map.on('dragend', () => {
          if (onMouseRelease && isDraggingRef.current) {
            onMouseRelease(map);
            isDraggingRef.current = false; // Reset drag flag
          }
        });

        // Optional: Listen for zoom events to ensure no interference
        map.on('zoomstart', () => {
          isDraggingRef.current = false; // Ensure zoom doesn't trigger onMouseRelease
        });
      }}
    />
  );
}