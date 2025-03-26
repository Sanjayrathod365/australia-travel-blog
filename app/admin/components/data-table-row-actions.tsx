"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteButton from "./DeleteButton";

interface DataTableRowActionsProps<TData extends { type?: string }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { type?: string }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const id = row.getValue("id") as number;
  const type = row.original.type || "tags";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={`/admin/${type}/edit/${id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteButton postId={id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 