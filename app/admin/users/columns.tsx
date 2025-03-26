"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "@/app/admin/components/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import React from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const [isActive, setIsActive] = useState(user.active);

      const toggleActive = async () => {
        try {
          const response = await fetch(`/api/admin/users/${user.id}/toggle-active`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: !isActive })
          });

          if (!response.ok) throw new Error("Failed to update status");
          
          setIsActive(!isActive);
          toast.success(`User ${!isActive ? "activated" : "deactivated"} successfully`);
        } catch (error) {
          console.error("Error toggling user status:", error);
          toast.error("Failed to update user status");
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={isActive}
            onCheckedChange={toggleActive}
          />
          <span>{isActive ? "Active" : "Inactive"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} type="user" />,
  },
]; 