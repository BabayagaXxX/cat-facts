"use client";

import { useState } from "react";
import { CatFact } from "@/types";
import { getFacts } from "@/lib/api";
import { FactActionCard } from "@/components/features/FactActionCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface FactsPlaygroundProps {
    initialFacts: CatFact[];
}

export function FactsPlayground({ initialFacts }: FactsPlaygroundProps) {
    const [facts, setFacts] = useState<CatFact[]>(initialFacts);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = async () => {
        setLoading(true);
        try {
            const newFacts = await getFacts(5);
            setFacts(newFacts);
        } catch (error) {
            console.error("Failed to fetch facts", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Get New Facts
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {facts.map((fact, index) => (
                    <FactActionCard key={`${index}-${fact.length}`} fact={fact} />
                ))}
            </div>
        </div>
    );
}
