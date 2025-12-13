import { BreedResponse, CatFact, Breed, Adoption } from "@/types";

const BASE_URL = "https://catfact.ninja";

// ============================================
// EXTERNAL CAT FACTS API FUNCTIONS
// ============================================

/**
 * Fetches cat breeds from external API with pagination
 */
export async function getBreeds(page: number = 1): Promise<BreedResponse> {
    const res = await fetch(`${BASE_URL}/breeds?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch breeds");
    return res.json();
}

/**
 * Fetches a single random cat fact from external API
 */
export async function getFact(): Promise<CatFact> {
    const res = await fetch(`${BASE_URL}/fact`);
    if (!res.ok) throw new Error("Failed to fetch fact");
    return res.json();
}

/**
 * Fetches multiple cat facts from external API
 * Uses random page to get different facts each time
 */
export async function getFacts(limit: number = 20): Promise<CatFact[]> {
    const randomPage = Math.floor(Math.random() * 34) + 1; // API has 34 pages
    const maxLimit = Math.min(limit, 25); // API max is 25 per page
    
    const res = await fetch(`${BASE_URL}/facts?limit=${maxLimit}&page=${randomPage}&_=${Date.now()}`, {
        cache: 'no-store', // Always fetch fresh data
        next: { revalidate: 0 }
    });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch facts: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.data; // API returns { data: [...] }
}

// ============================================
// LOCAL DATABASE API FUNCTIONS - BREEDS
// ============================================

/**
 * Fetches all breeds from our local database
 */
export async function getLocalBreeds(): Promise<Breed[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/breeds`, { 
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) throw new Error("Failed to fetch local breeds");
    return res.json();
}

/**
 * Adds a new breed to our local database
 */
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

// ============================================
// LOCAL DATABASE API FUNCTIONS - FACTS
// ============================================

/**
 * Fetches all saved facts from our local database
 */
export async function getLocalFacts(): Promise<CatFact[]> {
    const res = await fetch('/api/facts', { 
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) throw new Error("Failed to fetch local facts");
    return res.json();
}

/**
 * Saves a single fact to our local database
 */
export async function saveFact(fact: CatFact): Promise<CatFact> {
    const res = await fetch('/api/facts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fact),
    });
    if (!res.ok) throw new Error("Failed to save fact");
    return res.json();
}

/**
 * Saves multiple facts to our local database at once
 */
export async function saveMultipleFacts(facts: CatFact[]): Promise<void> {
    await Promise.all(facts.map(fact => saveFact(fact)));
}

/**
 * Clears all facts from our local database
 */
export async function clearLocalFacts(): Promise<void> {
    const res = await fetch('/api/facts', { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to clear facts");
}

// ============================================
// LOCAL DATABASE API FUNCTIONS - ADOPTIONS
// ============================================

/**
 * Fetches all adoption listings from our local database
 */
export async function getAdoptions(): Promise<Adoption[]> {
    const res = await fetch('/api/adoptions', { 
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) throw new Error("Failed to fetch adoptions");
    return res.json();
}

/**
 * Creates a new adoption listing in our local database
 */
export async function addAdoption(formData: FormData): Promise<Adoption> {
    const res = await fetch('/api/adoptions', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Failed to add adoption");
    }
    return res.json();
}

/**
 * Updates the adoption status of a cat
 */
export async function updateAdoptionStatus(id: number, status: 'available' | 'adopted'): Promise<Adoption> {
    const res = await fetch(`/api/adoptions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Failed to update adoption status");
    }
    return res.json();
}

/**
 * Soft deletes an adopted cat (sets deleted_at timestamp)
 */
export async function softDeleteAdoption(id: number): Promise<void> {
    const res = await fetch(`/api/adoptions/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Failed to delete adoption");
    }
}
