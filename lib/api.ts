import { BreedResponse, CatFact, Breed } from "@/types";

const BASE_URL = "https://catfact.ninja";

export async function getBreeds(page: number = 1): Promise<BreedResponse> {
    const res = await fetch(`${BASE_URL}/breeds?page=${page}`);
    if (!res.ok) {
        throw new Error("Failed to fetch breeds");
    }
    return res.json();
}

export async function getFact(): Promise<CatFact> {
    const res = await fetch(`${BASE_URL}/fact`);
    if (!res.ok) {
        throw new Error("Failed to fetch fact");
    }
    return res.json();
}

export async function getFacts(limit: number = 20): Promise<CatFact[]> {
    // Add random page to get different facts each time (API has 34 pages)
    const randomPage = Math.floor(Math.random() * 34) + 1;
    const maxLimit = Math.min(limit, 25); // API max is 25 per page
    
    console.log(`📡 Calling API: ${BASE_URL}/facts?limit=${maxLimit}&page=${randomPage}`);
    const res = await fetch(`${BASE_URL}/facts?limit=${maxLimit}&page=${randomPage}&_=${Date.now()}`, {
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    console.log('📡 API Response status:', res.status);
    if (!res.ok) {
        throw new Error(`Failed to fetch facts: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('📡 API Response data:', data);
    console.log(`📄 Fetched from page ${randomPage}`);
    return data.data; // The API returns { data: [...] } for /facts endpoint
}

export async function getLocalBreeds(): Promise<Breed[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/breeds`, { 
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch local breeds");
    }
    const data = await res.json();
    console.log('📥 Fetched local breeds:', data.length);
    return data;
}

export async function addBreed(formData: FormData): Promise<Breed> {
    const res = await fetch('/api/breeds', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Failed to add breed");
    }
    return res.json();
}

// Local facts from database
export async function getLocalFacts(): Promise<CatFact[]> {
    const res = await fetch('/api/facts', { 
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch local facts");
    }
    return res.json();
}

export async function saveFact(fact: CatFact): Promise<CatFact> {
    const res = await fetch('/api/facts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fact),
    });
    if (!res.ok) {
        throw new Error("Failed to save fact");
    }
    return res.json();
}

export async function saveMultipleFacts(facts: CatFact[]): Promise<void> {
    await Promise.all(facts.map(fact => saveFact(fact)));
}

export async function clearLocalFacts(): Promise<void> {
    const res = await fetch('/api/facts', { method: 'DELETE' });
    if (!res.ok) {
        throw new Error("Failed to clear facts");
    }
}
