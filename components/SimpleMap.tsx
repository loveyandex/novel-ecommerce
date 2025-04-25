'use client';

import { useEffect } from 'react';
import NeshanMap from './NeshanMap';

interface SimpleMapProps {
  onMouseRelease: (map: any) => void;
}

export default function SimpleMap({ onMouseRelease }: SimpleMapProps) {
  return (
    <NeshanMap
      options={{
        key: 'web.DQdth5W91qXg4C57n9kMwCPPVoWJXcfF827t1ob3',
        maptype: 'neshan',
        poi: true,
        traffic: false,
        center: [35.70082243535813, 51.336965560913086],
        zoom: 15,
      }}
      onInit={(L, map) => {
        const crosshairIcon = L.icon({
          iconUrl: '/mapPinLocation.svg',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const motorIcon = L.icon({
          iconUrl: '/mapDriverPin.svg',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const crosshair = new L.marker({ lat: 35.70015330282006, lng: 51.33730030007428 }, { icon: crosshairIcon, interactive: false });
        const crosshair2 = new L.marker({ lat: 35.7004, lng: 51.338 }, { icon: motorIcon, interactive: false });
        crosshair.addTo(map);
        crosshair2.addTo(map);

        map.on('move', () => {
          crosshair.setLatLng(map.getCenter());
        });

        map.on('mouseup', () => {
          const center = map.getCenter();
          onMouseRelease(map);
          fetch(`https://api.neshan.org/v4/reverse?lat=${center.lat}&lng=${center.lng}`, {
            method: 'GET',
            headers: { 'Api-Key': 'service.Ornq0Gg6rHELQm9QVonknQskY8C6HKfFcuxXQj9M' },
          })
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.error('Fetch error:', error));
        });

        map.on('zoomend', () => {
          crosshair.setLatLng(map.getCenter());
        });
      }}
    />
  );
}