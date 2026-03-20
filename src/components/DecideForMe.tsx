"use client";

import { useState, useEffect } from "react";
import { Restaurant } from "@/lib/mockData";
import { RestaurantCard } from "./RestaurantCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Navigation, Map } from "lucide-react";

interface DecideForMeProps {
  restaurants: (Restaurant & { distance?: number })[];
}

export function DecideForMe({ restaurants }: DecideForMeProps) {
  const [selected, setSelected] = useState<(Restaurant & { distance?: number }) | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentShuffleName, setCurrentShuffleName] = useState("");
  const [vetoedIds, setVetoedIds] = useState<Set<string>>(new Set());
  const [prevRestaurants, setPrevRestaurants] = useState(restaurants);

  // Reset vetoes if the input list changes (e.g., user changed filters)
  if (restaurants !== prevRestaurants) {
    setVetoedIds(new Set());
    setPrevRestaurants(restaurants);
  }

  const availableRestaurants = restaurants.filter(r => !vetoedIds.has(r.id));

  const handleDecide = () => {
    if (availableRestaurants.length === 0) return;

    setIsAnimating(true);
    setIsOpen(true);
    setSelected(null); // Clear selected during animation

    const shuffleDuration = 2500; // 2.5 seconds
    const shuffleInterval = 100; // change name every 100ms
    let elapsedTime = 0;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * availableRestaurants.length);
      setCurrentShuffleName(availableRestaurants[randomIdx].name);
      elapsedTime += shuffleInterval;

      if (elapsedTime >= shuffleDuration) {
        clearInterval(interval);
        // Pick final winner
        const finalIdx = Math.floor(Math.random() * availableRestaurants.length);
        setSelected(availableRestaurants[finalIdx]);
        setIsAnimating(false);
      }
    }, shuffleInterval);
  };

  const [shouldRespin, setShouldRespin] = useState(false);

  useEffect(() => {
    if (shouldRespin) {
      setTimeout(() => {
        handleDecide();
        setShouldRespin(false);
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRespin, vetoedIds]); // Include vetoedIds so it runs after state update

  const handleVeto = () => {
    if (selected) {
      setVetoedIds(prev => new Set(prev).add(selected.id));
      setShouldRespin(true);
    }
  };

  const getWazeLink = (lat: number, lng: number) => `waze://?ll=${lat},${lng}&navigate=yes`;
  const getGoogleMapsLink = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <>
      <div className="flex justify-center my-12 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 -z-10 animate-pulse" />
          <Button
            size="lg"
            className="rounded-full shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-bold text-lg px-10 py-8 border-4 border-background h-auto w-auto transition-all"
            onClick={handleDecide}
            disabled={availableRestaurants.length === 0 || isAnimating}
          >
            {isAnimating && !isOpen ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <PartyPopper className="w-6 h-6 mr-3 text-white" />
              </motion.div>
            ) : (
              <PartyPopper className="w-6 h-6 mr-3 text-white" />
            )}
            {isAnimating ? "Choosing..." : "Decide For Me!"}
          </Button>
        </motion.div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none focus-visible:ring-0">
          <AnimatePresence mode="wait">
            {isOpen && isAnimating && (
              <motion.div
                key="spinning"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="bg-card rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center text-center min-h-[400px] border-4 border-primary/20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mb-8"
                >
                  <PartyPopper className="w-16 h-16 text-primary" />
                </motion.div>
                <h3 className="text-xl text-muted-foreground font-medium mb-4">Finding the perfect spot...</h3>
                <motion.div
                  key={currentShuffleName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.1 }}
                  className="text-3xl font-black text-foreground"
                >
                  {currentShuffleName}
                </motion.div>
              </motion.div>
            )}

            {isOpen && !isAnimating && selected && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                  bounce: 0.5
                }}
                className="bg-card rounded-3xl overflow-hidden shadow-2xl relative border-4 border-primary/20"
              >
                <DialogHeader className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 text-center pb-4">
                  <DialogTitle className="text-2xl font-black text-primary tracking-tight flex items-center justify-center gap-2">
                    <PartyPopper className="w-6 h-6 text-primary" />
                    We have a winner!
                  </DialogTitle>
                </DialogHeader>
                <div className="p-4 bg-muted/10">
                  <RestaurantCard restaurant={selected} distanceKm={selected.distance} />
                </div>
                <div className="p-6 pt-2 bg-muted/10 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={getWazeLink(selected.lat, selected.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-xl py-4 font-bold bg-[#33ccff] hover:bg-[#33ccff]/90 text-black shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Waze
                    </a>
                    <a
                      href={getGoogleMapsLink(selected.lat, selected.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-xl py-4 font-bold bg-[#34A853] hover:bg-[#34A853]/90 text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Google Maps
                    </a>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                     <Button
                      className="w-full rounded-xl py-6 text-md font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      Looks Good!
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10"
                      onClick={handleVeto}
                      disabled={availableRestaurants.length <= 1}
                    >
                      Not feeling this. Spin Again!
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
