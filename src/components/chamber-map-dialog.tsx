"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { MapPin, Clock, Building2, Navigation, ExternalLink, Loader2 } from "lucide-react"

interface Doctor {
  id: string | number
  name: string
  specializationLabel: string
  chamberAddress: string
  chamberLocation: { lat: number; lng: number }
  chamberTime: string
  chamberDays: string
  hospital: string
}

interface ChamberMapDialogProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor
}

export default function ChamberMapDialog({ isOpen, onClose, doctor }: ChamberMapDialogProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!isOpen || !mapRef.current) return

    // Clean up previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Small delay to ensure dialog is fully rendered
    const timer = setTimeout(() => {
      if (!mapRef.current) return

      // Initialize map
      const map = L.map(mapRef.current, {
        center: [doctor.chamberLocation.lat, doctor.chamberLocation.lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      })

      mapInstanceRef.current = map

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      // Custom marker icon
      const chamberIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            border: 3px solid white;
          ">
            <svg 
              style="transform: rotate(45deg); width: 20px; height: 20px; color: white;"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2.5"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })

      // Add marker with popup
      const marker = L.marker([doctor.chamberLocation.lat, doctor.chamberLocation.lng], {
        icon: chamberIcon,
      }).addTo(map)

      // Popup content
      marker.bindPopup(`
        <div style="min-width: 200px; padding: 4px;">
          <p style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0; color: #1e293b;">
            ${doctor.name}
          </p>
          <p style="font-size: 12px; color: #2563eb; margin: 0 0 8px 0;">
            ${doctor.specializationLabel}
          </p>
          <p style="font-size: 12px; color: #64748b; margin: 0;">
            ${doctor.chamberAddress}
          </p>
        </div>
      `).openPopup()

      // Force map to recalculate size
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isOpen, doctor])

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${doctor.chamberLocation.lat},${doctor.chamberLocation.lng}`
    window.open(url, "_blank")
  }

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${doctor.chamberLocation.lat},${doctor.chamberLocation.lng}`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Chamber Location
          </DialogTitle>
          <DialogDescription>
            {doctor.name}&apos;s chamber location
          </DialogDescription>
        </DialogHeader>

        {/* Doctor Info Card */}
        <div className="px-6 pb-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{doctor.hospital}</p>
                <p className="text-xs text-muted-foreground">{doctor.chamberAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {doctor.chamberTime} ({doctor.chamberDays})
              </p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="h-[300px] w-full border-t border-b border-border"
          style={{ zIndex: 0 }}
        />

        {/* Action Buttons */}
        <div className="p-4 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={getDirections}
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={openInGoogleMaps}
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
