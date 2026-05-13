'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { hospitals } from '@/src/data/hospitals';
import { Phone, Stethoscope, ArrowLeft, Navigation } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Header } from '@/src/components/header';

export default function RoutePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Request user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        () => {
          setLocationError('Unable to access your location. Using Dhaka center.');
        }
      );
    } else {
      setLocationError('Geolocation not supported in your browser.');
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const addUserLocationMarker = (L: any, location: [number, number]) => {
    if (!map.current || userMarker.current) return;

    userMarker.current = L.marker(location, {
      title: 'Your Location',
      icon: L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDk5ZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyI+PC9jaXJjbGU+PC9zdmc+',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
        className: 'user-location-icon',
      }),
    }).addTo(map.current);

    userMarker.current.bindPopup(`
      <div class="p-3 max-w-xs">
        <h3 class="font-semibold text-blue-600 mb-2">Your Location</h3>
        <p class="text-sm text-gray-600">${location[0].toFixed(6)}°N, ${Math.abs(location[1]).toFixed(6)}°E</p>
      </div>
    `);
  };

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    const L = (window as any).L;
    if (!L) return;

    const initialCenter = userLocation || [23.8103, 90.3563];
    map.current = L.map(mapContainer.current).setView(initialCenter, userLocation ? 14 : 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    if (userLocation) {
      addUserLocationMarker(L, userLocation);
    }

    hospitals.forEach((hospital) => {
      const hospitalMarker = L.marker([hospital.lat, hospital.lng], {
        title: hospital.name,
      }).addTo(map.current);

      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-gray-900 mb-2">${hospital.name}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <p><strong>Address:</strong> ${hospital.address}</p>
            <p><strong>Phone:</strong> <a href="tel:${hospital.phone}" class="text-blue-600 hover:text-blue-700">${hospital.phone}</a></p>
            <p><strong>Specialties:</strong> ${hospital.specialties.join(', ')}</p>
          </div>
        </div>
      `;

      hospitalMarker.bindPopup(popupContent);

      hospitalMarker.on('click', () => {
        setSelectedHospital(hospital.id);
        hospitalMarker.openPopup();
      });

      markers.current.push({ id: hospital.id, marker: hospitalMarker });
    });
  };

  useEffect(() => {
    if (!mapLoaded) return;
    initializeMap();

    const L = (window as any).L;
    if (L && map.current && userLocation) {
      if (!userMarker.current) {
        map.current.setView(userLocation, 14);
        addUserLocationMarker(L, userLocation);
      }
    }
  }, [mapLoaded, userLocation]);

  const getDistance = ([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedHospitals = useMemo(() => {
    if (!userLocation) return hospitals.map((hospital) => ({ ...hospital, distance: undefined }));

    return hospitals
      .map((hospital) => ({
        ...hospital,
        distance: getDistance(userLocation, [hospital.lat, hospital.lng]),
      }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [userLocation]);

  const handleGoToMyLocation = () => {
    if (!map.current || !userLocation) return;

    map.current.flyTo(userLocation, 16, {
      duration: 1.2,
    });

    if (userMarker.current) {
      userMarker.current.openPopup();
    }
  };

  const handleHospitalSelect = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    const markerData = markers.current.find((m) => m.id === hospitalId);
    if (markerData && map.current) {
      map.current.setView(markerData.marker.getLatLng(), 16);
      markerData.marker.openPopup();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Hospital Locator - Dhaka</h1>
          </div>
        </div>
      </header> */}
      <Header/>

      <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8 mt-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Hospital Locator</h1>
            <p className="text-sm text-gray-600">Tap the button to move the map to your current location.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer "
            onClick={handleGoToMyLocation}
            disabled={!userLocation || !mapLoaded}
          >
            <Navigation className="w-4 h-4" />
            My Location
          </Button>
        </div>

        {userLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Your location detected!</strong> 
              {/* {userLocation[0].toFixed(4)}°N, {Math.abs(userLocation[1]).toFixed(4)}°E. */}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Hospital List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              All Hospitals ({hospitals.length})
            </h2>
            <div className="space-y-2">
              {sortedHospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => handleHospitalSelect(hospital.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedHospital === hospital.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                      {hospital.name}
                    </h3>
                    {hospital.distance !== undefined && (
                      <span className="text-xs text-gray-500">
                        {hospital.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {hospital.phone}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                    <Stethoscope className="w-3 h-3" />
                    {hospital.specialties.slice(0, 2).join(', ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div
              ref={mapContainer}
              className="w-full"
              style={{ height: 'calc(100vh - 150px)', minHeight: '500px' }}
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {locationError ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">{locationError}</p>
          </div>
        ) : userLocation ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>Your location detected!</strong> Blue marker shows your current position. Find nearby hospitals below.
            </p>
          </div>
        ) : null}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Showing all {hospitals.length} hospitals in Dhaka.</strong> Click on any hospital in the list or on the map to view detailed information including address, phone number, and available specialties.
          </p>
        </div>
      </div> */}
    </div>
  );
}
