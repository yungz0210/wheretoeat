"use client";

import { Restaurant } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  restaurant: Restaurant;
  distanceKm?: number;
}

export function RestaurantCard({ restaurant, distanceKm }: RestaurantCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card rounded-2xl">
        <div className="relative h-48 w-full">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-foreground">
            {restaurant.price}
          </div>
        </div>

        <CardHeader className="p-5 pb-2 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground leading-tight">
              {restaurant.name}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.cuisine.map((c) => (
              <Badge key={c} variant="secondary" className="font-medium bg-secondary text-secondary-foreground rounded-lg px-2.5 py-0.5 text-xs">
                {c}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardFooter className="p-5 pt-4 border-t border-border/40 flex justify-between text-sm text-muted-foreground bg-muted/20">
          <div className="flex items-center gap-1.5 font-medium">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-foreground">{restaurant.rating.toFixed(1)}</span>
            <span className="text-muted-foreground/80 font-normal">({restaurant.reviews})</span>
          </div>

          {distanceKm !== undefined && (
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{distanceKm < 1 ? '< 1' : distanceKm.toFixed(1)} km</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
