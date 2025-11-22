import { getFacts } from "@/lib/api";
import { FactsPlayground } from "@/components/features/FactsPlayground";

export default async function PlaygroundPage() {
    let facts = [];
    try {
        facts = await getFacts(6);
    } catch (error) {
        console.error("Failed to fetch initial facts", error);
        // Fallback facts if API fails
        facts = [
            { fact: "Cats sleep 70% of their lives.", length: 28 },
            { fact: "A group of cats is called a clowder.", length: 36 },
            { fact: "Cats have over 20 muscles that control their ears.", length: 49 },
        ];
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Fact Playground</h1>
                <p className="text-muted-foreground">Discover, remix, and share amazing cat facts.</p>
            </div>

            <FactsPlayground initialFacts={facts} />
        </div>
    );
}
