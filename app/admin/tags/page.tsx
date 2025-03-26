import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/app/lib/db";
import { DataTable } from "@/app/admin/components/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Plus, Tag as TagIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Manage Tags",
  description: "Manage blog tags",
};

export default async function TagsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const result = await query(`
    SELECT 
      t.*,
      COUNT(pt.post_id) as post_count,
      'tags' as type
    FROM tags t
    LEFT JOIN post_tags pt ON t.id = pt.tag_id
    GROUP BY t.id
    ORDER BY t.name ASC
  `);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm">
                <TagIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tags</h1>
                <p className="text-gray-500 text-sm">
                  Organize and manage your blog content with tags
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/tags/new"
            className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 h-11 px-6 py-2 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-700/30 hover:-translate-y-0.5"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Tag
          </Link>
        </div>
        <Card className="overflow-hidden border border-gray-100 bg-white/50 backdrop-blur-xl shadow-xl shadow-gray-200/40">
          <DataTable columns={columns} data={result.rows} />
        </Card>
      </div>
    </div>
  );
} 