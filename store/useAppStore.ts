import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HybridBreed, FactAction } from '@/types';

interface AppState {
    hybridBreeds: HybridBreed[];
    savedFacts: FactAction[];
    addHybridBreed: (breed: HybridBreed) => void;
    removeHybridBreed: (id: string) => void;
    saveFactAction: (action: FactAction) => void;
    removeFactAction: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            hybridBreeds: [],
            savedFacts: [],
            addHybridBreed: (breed) =>
                set((state) => ({ hybridBreeds: [breed, ...state.hybridBreeds] })),
            removeHybridBreed: (id) =>
                set((state) => ({
                    hybridBreeds: state.hybridBreeds.filter((b) => b.id !== id),
                })),
            saveFactAction: (action) =>
                set((state) => ({ savedFacts: [action, ...state.savedFacts] })),
            removeFactAction: (id) =>
                set((state) => ({
                    savedFacts: state.savedFacts.filter((f) => f.id !== id),
                })),
        }),
        {
            name: 'cat-facts-storage',
        }
    )
);
