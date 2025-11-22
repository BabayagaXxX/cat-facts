"use client";

import { useState } from "react";
import { Breed, BreedResponse } from "@/types";
import { BreedCard } from "@/components/features/BreedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface BreedListProps {
    initialData: BreedResponse;
}

export function BreedList({ initialData }: BreedListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const filteredBreeds = initialData.data.filter((breed) =>
        breed.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (newPage: number) => {
        router.push(`/breeds?page=${newPage}`);
    };

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search breeds by name or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background text-foreground border-input"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredBreeds.map((breed, index) => (
                    <BreedCard key={`${breed.breed}-${index}`} breed={breed} />
                ))}
                {filteredBreeds.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No breeds found matching your search.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!initialData.prev_page_url}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-slate-600">
                    Page {initialData.current_page} of {initialData.last_page}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!initialData.next_page_url}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
