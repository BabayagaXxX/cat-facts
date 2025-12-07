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

export function FactsPlayground({ initialFacts }: FactsPlaygroundProps) {
    const [facts, setFacts] = useState<CatFact[]>(initialFacts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [updateKey, setUpdateKey] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Handle client-side mounting
    useState(() => {
        setMounted(true);
    });

    const handleLoadMore = async () => {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching new facts from API...');
        console.log('📊 Current facts (before):', facts.slice(0, 2).map(f => f.fact.substring(0, 40)));
        
        try {
            // Fetch new facts from external API
            const newFacts = await getFacts(10);
            console.log('✅ Received NEW facts from API:', newFacts.length);
            console.log('📊 New facts preview:', newFacts.slice(0, 2).map(f => f.fact.substring(0, 40)));
            
            // Clear old facts and save new ones to database
            console.log('💾 Saving facts to database...');
            await clearLocalFacts();
            await saveMultipleFacts(newFacts);
            console.log('✅ Facts saved to database!');
            
            // Force complete state update
            const timestamp = Date.now();
            setUpdateKey(timestamp); // Use timestamp for unique key
            setFacts(newFacts.map((f, i) => ({ ...f, _key: `${timestamp}-${i}` }))); // Add unique key to each fact
            setLastUpdate(new Date());
            
            console.log('📊 State updated! Facts should now display:', newFacts.slice(0, 2).map(f => f.fact.substring(0, 40)));
        } catch (error) {
            console.error("❌ Failed to fetch facts", error);
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
