"use client";

import { useState } from "react";
import { Breed, HybridBreed } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { HybridResultCard } from "@/components/features/HybridResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HybridCreatorProps {
    availableBreeds: Breed[];
}

export function HybridCreator({ availableBreeds }: HybridCreatorProps) {
    const [parentA, setParentA] = useState<string>("");
    const [parentB, setParentB] = useState<string>("");
    const [isBreeding, setIsBreeding] = useState(false);

    const { hybridBreeds, addHybridBreed, removeHybridBreed } = useAppStore();

    const handleBreed = () => {
        if (!parentA || !parentB) return;

        setIsBreeding(true);

        // Simulate breeding delay for effect
        setTimeout(() => {
            const breedA = availableBreeds.find(b => b.breed === parentA)!;
            const breedB = availableBreeds.find(b => b.breed === parentB)!;

            const newHybrid: HybridBreed = {
                id: crypto.randomUUID(),
                name: `${breedA.breed}-${breedB.breed} Hybrid`,
                parentA: breedA,
                parentB: breedB,
                coat: Math.random() > 0.5 ? breedA.coat : breedB.coat,
                pattern: Math.random() > 0.5 ? breedA.pattern : breedB.pattern,
                origin: `${breedA.country} / ${breedB.country}`,
                createdAt: Date.now(),
            };

            addHybridBreed(newHybrid);
            setIsBreeding(false);
            setParentA("");
            setParentB("");
        }, 1500);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Creator Section */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="border-primary/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Dna className="h-6 w-6" />
                            Create New Hybrid
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Parent Breed A</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={parentA}
                                onChange={(e) => setParentA(e.target.value)}
                            >
                                <option value="">Select a breed...</option>
                                {availableBreeds.map((breed) => (
                                    <option key={`a-${breed.breed}`} value={breed.breed}>
                                        {breed.breed}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Plus className="h-4 w-4 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Parent Breed B</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={parentB}
                                onChange={(e) => setParentB(e.target.value)}
                            >
                                <option value="">Select a breed...</option>
                                {availableBreeds.map((breed) => (
                                    <option key={`b-${breed.breed}`} value={breed.breed}>
                                        {breed.breed}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!parentA || !parentB || isBreeding}
                            onClick={handleBreed}
                        >
                            {isBreeding ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                    Breeding...
                                </>
                            ) : (
                                <>
                                    <Dna className="mr-2 h-4 w-4" />
                                    Create Hybrid
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Your Hybrids</h2>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {hybridBreeds.length} Created
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {hybridBreeds.map((hybrid) => (
                            <HybridResultCard
                                key={hybrid.id}
                                hybrid={hybrid}
                                onDelete={removeHybridBreed}
                            />
                        ))}
                    </AnimatePresence>

                    {hybridBreeds.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
                            <Dna className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg font-medium">No hybrids yet</p>
                            <p className="text-sm">Select two parent breeds to create your first hybrid!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
