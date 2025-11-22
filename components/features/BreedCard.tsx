import { Breed } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Palette, Scissors } from "lucide-react";

interface BreedCardProps {
    breed: Breed;
}

export function BreedCard({ breed }: BreedCardProps) {
    return (
        <Card className="group overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20">
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
                <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-pink-500" />
                    <span>{breed.coat} Coat</span>
                </div>
                <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-teal-500" />
                    <span>{breed.pattern} Pattern</span>
                </div>
            </CardContent>
        </Card>
    );
}
