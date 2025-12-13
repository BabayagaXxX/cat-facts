"use client";

import { useEffect, useState } from "react";
import { Adoption } from "@/types";
import { getAdoptions } from "@/lib/api";
import AdoptionCard from "./AdoptionCard";
import { AdoptionDetailsDialog } from "./AdoptionDetailsDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Component that displays a filterable list of cat adoptions
 * Users can filter by status and search by keywords
 * Click on a card to view details and adopt
 */
export default function AdoptionList() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [filtered, setFiltered] = useState<Adoption[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load adoptions when component mounts
  useEffect(() => {
    let cancelled = false;
    
    const loadAdoptions = async () => {
      setLoading(true);
      try {
        const data = await getAdoptions();
        if (!cancelled) {
          setAdoptions(data);
        }
      } catch (error) {
        console.error('Failed to load adoptions:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    loadAdoptions();
    return () => { cancelled = true; };
  }, []);

  // Filter adoptions whenever status, search query, or adoptions change
  useEffect(() => {
    const filtered = adoptions.filter((adoption) => {
      // Filter by status
      const matchesStatus = status === "all" || 
                          (adoption.adoption_status || "").toLowerCase() === status.toLowerCase();
      
      // Filter by search query (searches name, breed, location, description)
      const searchText = `${adoption.name} ${adoption.breed} ${adoption.location} ${adoption.description}`.toLowerCase();
      const matchesSearch = !searchQuery || searchText.includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
    
    setFiltered(filtered);
  }, [status, searchQuery, adoptions]);

  /**
   * Opens the details dialog when a card is clicked
   */
  const handleCardClick = (adoption: Adoption) => {
    setSelectedAdoption(adoption);
    setDialogOpen(true);
  };

  /**
   * Refreshes the adoption list after an adoption status is updated
   */
  const handleAdoptionUpdated = async () => {
    try {
      const data = await getAdoptions();
      setAdoptions(data);
    } catch (error) {
      console.error('Failed to reload adoptions:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full border rounded h-9 px-2 bg-background"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="searchQuery">Search</Label>
          <Input 
            id="searchQuery" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search by name, breed, location" 
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No adoption listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AdoptionCard 
              key={a.id || `${a.name}-${a.contact_email}`} 
              adoption={a}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Adoption Details Dialog */}
      <AdoptionDetailsDialog
        adoption={selectedAdoption}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdoptionUpdated={handleAdoptionUpdated}
      />
    </div>
  );
}
