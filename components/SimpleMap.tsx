'use client';

import { useEffect, useRef } from 'react';
import NeshanMap from './NeshanMap';

interface SimpleMapProps {
  onMouseRelease?: (map: any) => void;
}

export default function SimpleMap({ onMouseRelease }: SimpleMapProps) {
  const LRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (mapRef.current && onMouseRelease) {
        onMouseRelease(mapRef.current);
      }
    };

    // Attach mouseup listener to the document
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMouseRelease]);

  return (
    <NeshanMap
      onInit={(L: any, map: any) => {
        LRef.current = L;
        mapRef.current = map;

        // Add dragstart event to detect when dragging starts
        map.on('dragstart', () => {
          // No action needed on dragstart, just ensuring drag events are handled
        });

        // Add dragend event as a fallback
        map.on('dragend', () => {
          if (onMouseRelease) {
            onMouseRelease(map);
          }
        });
      }}
    />
  );
}