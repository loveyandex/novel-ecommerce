'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MapContextType {
  mapLoc: { lat: number; lng: number } | undefined;
  setMapLoc: (loc: { lat: number; lng: number }) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [mapLoc, setMapLoc] = useState<{ lat: number; lng: number } | undefined>(undefined);

  return (
    <MapContext.Provider value={{ mapLoc, setMapLoc }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}