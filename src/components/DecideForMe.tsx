"use client";

import { useState } from "react";
import { Restaurant } from "@/lib/mockData";
import { RestaurantCard } from "./RestaurantCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface DecideForMeProps {
  restaurants: (Restaurant & { distance?: number })[];
}

export function DecideForMe({ restaurants }: DecideForMeProps) {
  const [selected, setSelected] = useState<(Restaurant & { distance?: number }) | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDecide = () => {
    if (restaurants.length === 0) return;

    setIsAnimating(true);

    // Simulate some "thinking" time
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      setSelected(restaurants[randomIndex]);
      setIsOpen(true);
      setIsAnimating(false);
    }, 600);
  };

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
            disabled={restaurants.length === 0 || isAnimating}
          >
            {isAnimating ? (
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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
          <AnimatePresence>
            {isOpen && selected && (
              <motion.div
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
                <div className="p-6 pt-2 bg-muted/10">
                  <Button
                    className="w-full rounded-xl py-6 text-md font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Looks Good!
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full mt-2 rounded-xl text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(handleDecide, 300);
                    }}
                  >
                    Roll again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
