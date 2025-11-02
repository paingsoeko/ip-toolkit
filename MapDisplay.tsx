import React, { useRef, useEffect } from 'react';
import { MapDisplayProps } from './types';

declare const L: any; // Use Leaflet from CDN

const MapDisplay = React.memo(({ coords, city }: MapDisplayProps) => {
    const mapRef = useRef(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && coords && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView(coords, 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
            L.marker(coords).addTo(mapInstance.current).bindPopup(`<b>${city}</b>`).openPopup();
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
        } else if (mapInstance.current && coords) {
            mapInstance.current.setView(coords, 12);
            mapInstance.current.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    mapInstance.current.removeLayer(layer);
                }
            });
            L.marker(coords).addTo(mapInstance.current).bindPopup(`<b>${city}</b>`).openPopup();
        }
    }, [coords, city]);

    return <div id="map" ref={mapRef}></div>;
});

export default MapDisplay;
