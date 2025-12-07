"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breed } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface EditBreedModalProps {
    breed: Breed & { id?: number };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditBreedModal({ breed, open, onOpenChange }: EditBreedModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        breed: breed.breed,
        country: breed.country,
        origin: breed.origin,
        coat: breed.coat,
        pattern: breed.pattern,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(breed.image_url || null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!breed.id) {
            setError("Cannot update breed without ID");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("id", breed.id.toString());
            data.append("breed", formData.breed);
            data.append("country", formData.country);
            data.append("origin", formData.origin);
            data.append("coat", formData.coat);
            data.append("pattern", formData.pattern);
            
            if (imageFile) {
                data.append("image", imageFile);
            }

            const res = await fetch('/api/breeds', {
                method: 'PUT',
                body: data,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || errorData.error || "Failed to update breed");
            }

            onOpenChange(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Failed to update breed", error);
            setError(error instanceof Error ? error.message : "Failed to update breed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async () => {
        if (!breed.id) return;
        
        if (!confirm(`Are you sure you want to delete "${breed.breed}"?`)) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/breeds?id=${breed.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || errorData.error || "Failed to delete breed");
            }

            onOpenChange(false);
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete breed", error);
            setError(error instanceof Error ? error.message : "Failed to delete breed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Breed</DialogTitle>
                    <DialogDescription>
                        Update the breed information and image.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {previewUrl && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-breed">Breed Name</Label>
                            <Input
                                id="edit-breed"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-country">Country</Label>
                            <Input
                                id="edit-country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-origin">Origin</Label>
                            <Input
                                id="edit-origin"
                                name="origin"
                                value={formData.origin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-coat">Coat</Label>
                            <Input
                                id="edit-coat"
                                name="coat"
                                value={formData.coat}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-pattern">Pattern</Label>
                            <Input
                                id="edit-pattern"
                                name="pattern"
                                value={formData.pattern}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Change Image</Label>
                            <Input
                                id="edit-image"
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

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Delete
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
