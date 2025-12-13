"use client";

import { useState } from "react";
import Image from "next/image";
import { Adoption } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateAdoptionStatus, softDeleteAdoption } from "@/lib/api";
import { Mail, Phone, MapPin, Heart, Loader2, Trash2 } from "lucide-react";

interface AdoptionDetailsDialogProps {
  adoption: Adoption | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdoptionUpdated: () => void;
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  adopted: "bg-blue-100 text-blue-700 border-blue-200",
};

/**
 * Dialog component for displaying detailed adoption information
 * Allows users to adopt a cat or delete adopted cats
 */
export function AdoptionDetailsDialog({
  adoption,
  open,
  onOpenChange,
  onAdoptionUpdated,
}: AdoptionDetailsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!adoption) return null;

  const statusColor = statusColors[adoption.adoption_status || "available"];
  const isAvailable = adoption.adoption_status === "available";
  const isAdopted = adoption.adoption_status === "adopted";

  /**
   * Handles the adoption button click
   * Changes status from "available" to "adopted"
   */
  const handleAdoptClick = async () => {
    if (!adoption.id) return;

    setLoading(true);
    setError(null);

    try {
      await updateAdoptionStatus(adoption.id, "adopted");
      onAdoptionUpdated(); // Refresh the list
      onOpenChange(false); // Close dialog
    } catch (error) {
      console.error("Failed to update adoption:", error);
      setError(error instanceof Error ? error.message : "Failed to update adoption");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles soft delete for adopted cats
   * Sets deleted_at timestamp without removing from database
   */
  const handleDelete = async () => {
    if (!adoption.id) return;

    const confirmDelete = confirm(
      `Are you sure you want to remove ${adoption.name} from the adoption list? This can be restored from the database if needed.`
    );

    if (!confirmDelete) return;

    setDeleting(true);
    setError(null);

    try {
      await softDeleteAdoption(adoption.id);
      onAdoptionUpdated(); // Refresh the list
      onOpenChange(false); // Close dialog
    } catch (error) {
      console.error("Failed to delete adoption:", error);
      setError(error instanceof Error ? error.message : "Failed to delete adoption");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{adoption.name}</DialogTitle>
          <DialogDescription>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
              {adoption.adoption_status}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {adoption.image_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <Image
                src={adoption.image_url}
                alt={adoption.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Breed</p>
              <p className="font-medium">{adoption.breed || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{adoption.age || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{adoption.gender || "Unknown"}</p>
            </div>
            {adoption.temperament && (
              <div>
                <p className="text-sm text-muted-foreground">Temperament</p>
                <p className="font-medium">{adoption.temperament}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {adoption.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">About {adoption.name}</p>
              <p className="text-sm leading-relaxed">{adoption.description}</p>
            </div>
          )}

          {/* Location */}
          {adoption.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{adoption.location}</p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="border-t pt-4 space-y-3">
            <p className="font-semibold">Contact Information</p>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${adoption.contact_email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {adoption.contact_email}
                  </a>
                </div>
              </div>
            </div>

            {adoption.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${adoption.contact_phone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {adoption.contact_phone}
                  </a>
                </div>
              </div>
            )}

            {adoption.contact_name && (
              <div className="text-sm text-muted-foreground">
                Contact: <span className="font-medium text-foreground">{adoption.contact_name}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isAvailable ? (
              <Button
                onClick={handleAdoptClick}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    I Want to Adopt {adoption.name}
                  </>
                )}
              </Button>
            ) : isAdopted ? (
              <>
                <div className="flex-1 text-center p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">
                    This cat has been adopted! 🎉
                  </p>
                </div>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </>
                  )}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
