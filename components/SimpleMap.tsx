'use client';

import { useEffect, useRef } from 'react';
import NeshanMap from './NeshanMap';

interface SimpleMapProps {
  onMouseRelease?: (map: any) => void;
}

export default function SimpleMap({ onMouseRelease }: SimpleMapProps) {
  const LRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const isDraggingRef = useRef(false);
  const isZoomingRef = useRef(false);

  useEffect(() => {
    const handleMouseUp = () => {
      if (mapRef.current && onMouseRelease && isDraggingRef.current && !isZoomingRef.current) {
        onMouseRelease(mapRef.current);
        isDraggingRef.current = false;
        isZoomingRef.current = false;
      }
    };

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

        map.on('dragstart', () => {
          isDraggingRef.current = true;
          isZoomingRef.current = false;
        });

        map.on('dragend', () => {
          if (onMouseRelease && isDraggingRef.current && !isZoomingRef.current) {
            onMouseRelease(map);
            isDraggingRef.current = false;
            isZoomingRef.current = false;
          }
        });

        map.on('zoomstart', () => {
          isDraggingRef.current = false;
          isZoomingRef.current = true;
        });

        map.on('zoomend', () => {
          if (onMouseRelease && isDraggingRef.current && !isZoomingRef.current) 
            onMouseRelease(map);

          console.log("zoomend")
          isZoomingRef.current = false;
        });
      }}
    />
  );
}