"use client";

import { useEffect, useState } from "react";
import { Adoption } from "@/types";
import { getAdoptions } from "@/lib/api";
import AdoptionCard from "./AdoptionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdoptionList() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [filtered, setFiltered] = useState<Adoption[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getAdoptions();
        if (!cancelled) {
          setAdoptions(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const s = status.toLowerCase();
    const query = q.trim().toLowerCase();
    const f = adoptions.filter((a) => {
      const byStatus = s === "all" || (a.adoption_status || "").toLowerCase() === s;
      const text = `${a.name || ""} ${a.breed || ""} ${a.location || ""} ${a.description || ""}`.toLowerCase();
      const byQuery = !query || text.includes(query);
      return byStatus && byQuery;
    });
    setFiltered(f);
  }, [status, q, adoptions]);

  return (
    <div className="space-y-4">
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
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="q">Search</Label>
          <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, breed, location" />
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
            <AdoptionCard key={a.id || `${a.name}-${a.contact_email}`} adoption={a} />
          ))}
        </div>
      )}
    </div>
  );
}
