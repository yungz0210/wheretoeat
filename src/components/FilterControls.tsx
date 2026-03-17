"use client";

import { CuisineType } from "@/lib/mockData";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FilterState {
  cuisine: string;
  maxDistance: string;
  price: string;
}

interface FilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function FilterControls({ filters, setFilters }: FilterProps) {
  const cuisineOptions: (CuisineType | "All")[] = ["All", "Malaysian", "Mamak", "Kopitiam", "Cafe", "Healthy", "Macro-Friendly", "Italian", "Asian", "Fast Food"];
  const distanceOptions = ["1", "3", "5", "10", "Any"];
  const priceOptions = ["All", "$", "$$", "$$$"];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-card p-6 rounded-3xl shadow-sm border mb-8 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <Label className="text-muted-foreground font-semibold mb-2 block">Cuisine</Label>
        <Select value={filters.cuisine} onValueChange={(val) => handleFilterChange("cuisine", val || "All")}>
          <SelectTrigger className="w-full bg-background rounded-xl">
            <SelectValue placeholder="Select Cuisine" />
          </SelectTrigger>
          <SelectContent>
            {cuisineOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label className="text-muted-foreground font-semibold mb-2 block">Max Distance (km)</Label>
        <Select value={filters.maxDistance} onValueChange={(val) => handleFilterChange("maxDistance", val || "Any")}>
          <SelectTrigger className="w-full bg-background rounded-xl">
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            {distanceOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "Any" ? "Any Distance" : `${option} km`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label className="text-muted-foreground font-semibold mb-2 block">Price Range</Label>
        <Select value={filters.price} onValueChange={(val) => handleFilterChange("price", val || "All")}>
          <SelectTrigger className="w-full bg-background rounded-xl">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
