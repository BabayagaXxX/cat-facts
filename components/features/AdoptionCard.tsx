"use client";

import Image from "next/image";
import { Adoption } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  adoption: Adoption;
  onClick?: (adoption: Adoption) => void;
};

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  adopted: "bg-blue-100 text-blue-700",
};

export default function AdoptionCard({ adoption, onClick }: Props) {
  const color = statusColors[adoption.adoption_status || "available"];  
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition cursor-pointer"
      onClick={() => onClick?.(adoption)}
    >
      <div className="relative w-full h-40 bg-muted">
        {adoption.image_url ? (
          <Image
            src={adoption.image_url}
            alt={adoption.name || "Cat for adoption"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold truncate">{adoption.name}</h3>
          <span className={`px-2 py-1 rounded text-xs ${color}`}>{adoption.adoption_status}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {adoption.breed ? adoption.breed : "Unknown breed"}
          {adoption.age ? ` • ${adoption.age}` : ""}
          {adoption.gender ? ` • ${adoption.gender}` : ""}
        </p>
        {adoption.location && (
          <p className="text-xs text-muted-foreground">{adoption.location}</p>
        )}
      </CardContent>
    </Card>
  );
}
