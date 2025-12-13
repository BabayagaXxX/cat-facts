import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HybridBreed, FactAction } from '@/types';

/**
 * Global Application State using Zustand
 * 
 * This store manages client-side data that persists in localStorage:
 * - hybridBreeds: Custom breeds created by mixing two breeds
 * - savedFacts: Cat facts saved by the user for later reference
 * 
 * The 'persist' middleware automatically saves data to localStorage,
 * so data persists even when the user closes the browser.
 */
interface AppState {
    // State
    hybridBreeds: HybridBreed[];
    savedFacts: FactAction[];
    
    // Actions
    addHybridBreed: (breed: HybridBreed) => void;
    removeHybridBreed: (id: string) => void;
    saveFactAction: (action: FactAction) => void;
    removeFactAction: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial state
            hybridBreeds: [],
            savedFacts: [],
            
            // Add a new hybrid breed to the beginning of the list
            addHybridBreed: (breed) =>
                set((state) => ({ 
                    hybridBreeds: [breed, ...state.hybridBreeds] 
                })),
            
            // Remove a hybrid breed by its ID
            removeHybridBreed: (id) =>
                set((state) => ({
                    hybridBreeds: state.hybridBreeds.filter((b) => b.id !== id),
                })),
            
            // Save a fact action to the beginning of the list
            saveFactAction: (action) =>
                set((state) => ({ 
                    savedFacts: [action, ...state.savedFacts] 
                })),
            
            // Remove a saved fact by its ID
            removeFactAction: (id) =>
                set((state) => ({
                    savedFacts: state.savedFacts.filter((f) => f.id !== id),
                })),
        }),
        {
            name: 'cat-facts-storage', // localStorage key name
        }
    )
);
