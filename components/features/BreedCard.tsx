"use client";

import { useState } from "react";
import { Breed } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Palette, Scissors } from "lucide-react";
import { EditBreedModal } from "./EditBreedModal";

interface BreedCardProps {
    breed: Breed & { id?: number };
}

export function BreedCard({ breed }: BreedCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    // Only allow editing for local breeds (those with an ID)
    const isLocalBreed = !!breed.id;

    return (
        <>
            <Card 
                className={`group overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20 ${isLocalBreed ? 'cursor-pointer' : ''}`}
                onClick={() => isLocalBreed && setIsEditOpen(true)}
            >
            {breed.image_url ? (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                        src={breed.image_url}
                        alt={breed.breed}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            ) : (
                <div className="relative aspect-video w-full overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">No image</div>
                </div>
            )}
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                    {breed.breed}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{breed.country}</span>
                </div>
                {breed.coat && (
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-pink-500" />
                        <span>{breed.coat} Coat</span>
                    </div>
                )}
                {breed.pattern && (
                    <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-teal-500" />
                        <span>{breed.pattern} Pattern</span>
                    </div>
                )}
            </CardContent>
        </Card>
        {isLocalBreed && (
            <EditBreedModal 
                breed={breed} 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
            />
        )}
        </>
    );
}
