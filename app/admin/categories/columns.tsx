import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/app/admin/components/data-table-column-header";
import { DataTableRowActions } from "@/app/admin/components/data-table-row-actions";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    accessorKey: "post_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posts" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]; 