import { BreedResponse, CatFact } from "@/types";

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

export async function getFacts(limit: number = 5): Promise<CatFact[]> {
    const res = await fetch(`${BASE_URL}/facts?limit=${limit}`);
    if (!res.ok) {
        throw new Error("Failed to fetch facts");
    }
    const data = await res.json();
    return data.data; // The API returns { data: [...] } for /facts endpoint
}
