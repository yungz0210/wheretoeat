"use client";

import { useState, useMemo } from "react";
import { mockRestaurants } from "@/lib/mockData";
import { calculateDistance } from "@/lib/utils";
import { GeolocationButton } from "@/components/GeolocationButton";
import { FilterControls, FilterState } from "@/components/FilterControls";
import { RestaurantCard } from "@/components/RestaurantCard";
import { DecideForMe } from "@/components/DecideForMe";
import { motion } from "framer-motion";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    cuisine: "All",
    maxDistance: "Any",
    price: "All",
  });

  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setLocationError(null);
  };

  const filteredRestaurants = useMemo(() => {
    return mockRestaurants
      .map((restaurant) => {
        let distance: number | undefined;
        if (userLocation) {
          distance = calculateDistance(userLocation.lat, userLocation.lng, restaurant.lat, restaurant.lng);
        }
        return { ...restaurant, distance };
      })
      .filter((restaurant) => {
        // Cuisine Filter
        if (filters.cuisine !== "All" && !restaurant.cuisine.includes(filters.cuisine as never)) {
          return false;
        }

        // Distance Filter
        if (filters.maxDistance !== "Any" && restaurant.distance !== undefined) {
          const maxDist = parseFloat(filters.maxDistance);
          if (restaurant.distance > maxDist) {
            return false;
          }
        }

        // Price Filter
        if (filters.price !== "All" && restaurant.price !== filters.price) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by distance if available
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      });
  }, [userLocation, filters]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary/20">
      <main className="container mx-auto px-4 max-w-5xl">
        <header className="py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent inline-block drop-shadow-sm">
              Where to Eat?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Can&apos;t decide? Let&apos;s find something delicious nearby.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            {!userLocation && (
              <GeolocationButton
                onLocationFound={handleLocationFound}
                locationError={locationError}
                setLocationError={setLocationError}
              />
            )}

            {userLocation && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary font-semibold rounded-full text-md mb-4 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                Location Found
              </div>
            )}
          </motion.div>
        </header>

        <section className="relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <FilterControls filters={filters} setFilters={setFilters} />
          </motion.div>
        </section>

        {filteredRestaurants.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <DecideForMe restaurants={filteredRestaurants} />
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">No restaurants found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or expanding your search distance.</p>
          </div>
        )}

        <section>
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {filteredRestaurants.length} Options
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(index, 10), duration: 0.4 }}
                className="h-full"
              >
                <RestaurantCard
                  restaurant={restaurant}
                  distanceKm={restaurant.distance}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
