"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface GeolocationProps {
  onLocationFound: (lat: number, lng: number) => void;
  locationError?: string | null;
  setLocationError: (error: string | null) => void;
}

export function GeolocationButton({ onLocationFound, locationError, setLocationError }: GeolocationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationFound(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Please allow location access to find restaurants near you.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={requestLocation}
          disabled={isLoading}
          size="lg"
          className="rounded-full shadow-md font-semibold text-md px-8 py-6"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-5 w-5" />
          )}
          Find My Location
        </Button>
      </motion.div>
      {locationError && (
        <p className="text-destructive text-sm font-medium mt-2">{locationError}</p>
      )}
    </div>
  );
}
