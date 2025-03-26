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

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const result = await query(`
    SELECT 
      c.*,
      COUNT(pc.post_id) as post_count
    FROM categories c
    LEFT JOIN post_categories pc ON c.id = pc.category_id
    GROUP BY c.id
    ORDER BY c.name ASC
  `);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <a
          href="/admin/categories/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Category
        </a>
      </div>
      <DataTable columns={columns} data={result.rows} />
    </div>
  );
} 