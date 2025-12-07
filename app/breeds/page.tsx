import { Suspense } from "react";
import { getBreeds, getLocalBreeds } from "@/lib/api";
import { BreedList } from "@/components/features/BreedList";
import { AddBreedForm } from "@/components/features/AddBreedForm";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BreedsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;

    // Fetch both external and local breeds
    const [externalBreedsData, localBreeds] = await Promise.all([
        getBreeds(page),
        getLocalBreeds().catch((error) => {
            console.error('Failed to fetch local breeds:', error);
            return [];
        })
    ]);

    console.log('📊 Local breeds count:', localBreeds.length);
    console.log('📊 External breeds count:', externalBreedsData.data.length);

    // Combine breeds, putting local ones first
    const allBreeds = {
        ...externalBreedsData,
        data: [...localBreeds, ...externalBreedsData.data]
    };

    console.log('📊 Total breeds to display:', allBreeds.data.length);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Cat Breeds</h1>
                <p className="text-muted-foreground">Explore our extensive collection of cat breeds from around the world.</p>
            </div>

            <AddBreedForm />

            <Suspense fallback={<BreedsLoading />}>
                <BreedList initialData={allBreeds} />
            </Suspense>
        </div>
    );
}

function BreedsLoading() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
            ))}
        </div>
    );
}
