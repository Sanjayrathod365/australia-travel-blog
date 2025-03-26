import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/app/lib/db";
import { DataTable } from "@/app/admin/components/data-table";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Manage Categories",
  description: "Manage blog categories",
};

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  created_at: string;
  updated_at: string;
  type: string;
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const result = await query(`
    SELECT 
      c.*,
      COUNT(p.id) as post_count,
      'category' as type
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id
    GROUP BY c.id, c.name, c.slug, c.description, c.created_at, c.updated_at
    ORDER BY c.name ASC
  `);

  const categories = result.rows.map((category: Category) => ({
    ...category,
    type: 'category'
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <a
          href="/admin/categories/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </a>
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
} 