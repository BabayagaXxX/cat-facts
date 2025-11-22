import { getBreeds } from "@/lib/api";
import { HybridCreator } from "@/components/features/HybridCreator";

export default async function HybridPage() {
    // Fetch a larger list of breeds for the dropdowns
    // The API supports a 'limit' parameter, but the types defined earlier use 'page'.
    // We'll just fetch the first page which usually has 25 items, which is enough for a demo.
    // Ideally we would fetch all or search, but for this scope 25 is fine.
    // Actually, let's try to fetch a few pages or see if we can get more.
    // The API documentation says per_page=X works.

    let breeds = [];
    try {
        // Attempt to fetch more items if possible, otherwise default to page 1
        const res = await fetch("https://catfact.ninja/breeds?limit=100");
        const data = await res.json();
        breeds = data.data;
    } catch (e) {
        // Fallback to our typed client if manual fetch fails
        const data = await getBreeds(1);
        breeds = data.data;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Hybrid Lab</h1>
                <p className="text-muted-foreground">Combine traits from different breeds to create unique new cats.</p>
            </div>

            <HybridCreator availableBreeds={breeds} />
        </div>
    );
}
