"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { use } from "react";

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTag() {
      try {
        const response = await fetch(`/api/admin/tags/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tag");
        }
        const data = await response.json();
        setTag(data);
      } catch (error) {
        console.error("Error fetching tag:", error);
        toast.error("Failed to load tag");
      }
    }

    if (resolvedParams.id) {
      fetchTag();
    }
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tags/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tag.name,
          slug: tag.slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      toast.success("Tag updated successfully");
      router.push("/admin/tags");
      router.refresh();
    } catch (error) {
      console.error("Error updating tag:", error);
      toast.error("Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  if (!tag) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Tag</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={tag.name}
            onChange={(e) => setTag({ ...tag, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={tag.slug}
            onChange={(e) => setTag({ ...tag, slug: e.target.value })}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
} 