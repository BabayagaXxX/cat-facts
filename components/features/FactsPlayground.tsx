"use client";

import { useState } from "react";
import { CatFact } from "@/types";
import { getFacts, saveMultipleFacts, clearLocalFacts } from "@/lib/api";
import { FactActionCard } from "@/components/features/FactActionCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface FactsPlaygroundProps {
    initialFacts: CatFact[];
}

/**
 * Component for displaying and refreshing cat facts
 * Allows users to fetch new facts from the API and save them to the database
 */
export function FactsPlayground({ initialFacts }: FactsPlaygroundProps) {
    const [facts, setFacts] = useState<CatFact[]>(initialFacts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [updateKey, setUpdateKey] = useState(0);

    /**
 * Fetches new facts from the external API and replaces current facts
     * Steps: 1) Get new facts, 2) Clear old facts from DB, 3) Save new facts to DB, 4) Update UI
     */
    const handleLoadMore = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Step 1: Fetch fresh facts from the external cat facts API
            const newFacts = await getFacts(10);
            
            // Step 2: Clear old facts and save new ones to our database
            await clearLocalFacts();
            await saveMultipleFacts(newFacts);
            
            // Step 3: Update the UI with new facts
            setFacts(newFacts);
            setLastUpdate(new Date());
            setUpdateKey(Date.now()); // Force re-render of the grid
        } catch (error) {
            console.error("Failed to fetch facts:", error);
            setError(error instanceof Error ? error.message : "Failed to fetch facts");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Showing {facts.length} facts
                    {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
                </div>
                <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Loading..." : "Get New Facts"}
                </Button>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" key={updateKey}>
                {facts.map((fact, index) => (
                    <FactActionCard key={`${updateKey}-${index}-${fact.fact.substring(0, 30)}`} fact={fact} />
                ))}
            </div>
        </div>
    );
}
