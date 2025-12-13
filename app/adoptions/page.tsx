import AdoptionList from "@/components/features/AdoptionList";
import AddAdoptionForm from "@/components/features/AddAdoptionForm";

export const dynamic = "force-dynamic";

export default async function AdoptionsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Cat Adoption Listings</h1>
      <p className="text-sm text-muted-foreground">Create, browse, and manage cats available for adoption.</p>
      <AddAdoptionForm />
      <AdoptionList />
    </div>
  );
}
