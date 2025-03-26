'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Tag } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Tag>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 py-2">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.getValue('name')}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'post_count',
    header: 'Posts',
    cell: ({ row }) => {
      const count = row.getValue('post_count') as number;
      return (
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {count}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const tag = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/tags/edit/${tag.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-gray-100">
              <Edit className="h-4 w-4 text-gray-600" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-0 hover:bg-red-100"
            onClick={() => {
              if (confirm('Are you sure you want to delete this tag?')) {
                fetch(`/api/admin/tags/${tag.id}`, {
                  method: 'DELETE',
                }).then(() => {
                  window.location.reload();
                });
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
]; 