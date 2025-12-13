"use client";

import { useEffect, useState } from "react";
import { Breed, Adoption } from "@/types";
import { addAdoption, getLocalBreeds } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AddAdoptionForm() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLocalBreeds();
        setBreeds(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      setSaving(true);
      const created: Adoption = await addAdoption(fd);
      setMessage(`Adoption created: ${created.name}`);
      setTimeout(() => setMessage(null), 3000);
      form.reset();
      window.location.reload();
    } catch (err: any) {
      setMessage(err?.message || "Failed to create adoption");
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4 space-y-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="breed_id">Breed</Label>
              <select id="breed_id" name="breed_id" className="mt-1 w-full border rounded h-9 px-2 bg-background" required>
                <option value="">Select breed</option>
                {breeds.map((b) => (
                  <option key={b.id} value={b.id || ""}>{b.breed}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" placeholder="e.g., 2 years" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Gender</Label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" value="Male" /> Male</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" value="Female" /> Female</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="gender" value="Unknown" defaultChecked /> Unknown</label>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" />
            </div>
            <div>
              <Label htmlFor="temperament">Temperament</Label>
              <Input id="temperament" name="temperament" placeholder="e.g., Playful, Calm" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea id="description" name="description" className="mt-1 w-full border rounded p-2 bg-background min-h-[90px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input id="contact_name" name="contact_name" />
            </div>
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input id="contact_email" name="contact_email" type="email" />
            </div>
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input id="contact_phone" name="contact_phone" />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Adoption"}</Button>
            {message && <span className="text-sm text-muted-foreground">{message}</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
