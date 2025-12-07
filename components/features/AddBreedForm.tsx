"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBreed } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddBreedForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        breed: "",
        country: "",
        origin: "",
        coat: "",
        pattern: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const data = new FormData();
            data.append("breed", formData.breed);
            data.append("country", formData.country);
            data.append("origin", formData.origin);
            data.append("coat", formData.coat);
            data.append("pattern", formData.pattern);
            if (imageFile) {
                data.append("image", imageFile);
            }

            const result = await addBreed(data);
            console.log('✅ Breed added:', result);
            
            // Reset form
            setFormData({
                breed: "",
                country: "",
                origin: "",
                coat: "",
                pattern: "",
            });
            setImageFile(null);
            
            // Reset file input
            const fileInput = document.getElementById('image') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            
            // Force a hard refresh with cache bypass
            router.refresh();
            
            // Also reload the page data
            window.location.reload();
        } catch (error) {
            console.error("Failed to add breed", error);
            setError(error instanceof Error ? error.message : "Failed to add breed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Add New Breed</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="breed">Breed Name</Label>
                            <Input
                                id="breed"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="origin">Origin</Label>
                            <Input
                                id="origin"
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="coat">Coat</Label>
                            <Input
                                id="coat"
                                name="coat"
                                value={formData.coat}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pattern">Pattern</Label>
                            <Input
                                id="pattern"
                                name="pattern"
                                value={formData.pattern}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Breed Image</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 dark:text-green-400">
                            ✅ Breed added successfully!
                        </div>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Breed"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
