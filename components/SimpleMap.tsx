'use client';
import * as L from 'leaflet';
import { useEffect, useRef, memo } from 'react';
import NeshanMap from './NeshanMap';

interface SimpleMapProps {
  onMouseRelease?: (map: L.Map) => void;
  setMapInstance?: (map: L.Map) => void;
}

function SimpleMap({ onMouseRelease, setMapInstance }: SimpleMapProps) {
  const LRef = useRef<typeof L | null>(null);
  const mapRef = useRef<L.Map | null>(null);
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
      onInit={(l:typeof L, map: L.Map) => {
        LRef.current = l;
        mapRef.current = map;

        // Pass the map instance to the parent
        if (setMapInstance) {
          setMapInstance(map);
        }

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
          if (onMouseRelease && !isDraggingRef.current) {
            onMouseRelease(map);
          }
          isZoomingRef.current = false;
          isDraggingRef.current = false;
        });
      }}
    />
  );
}

export default memo(SimpleMap);