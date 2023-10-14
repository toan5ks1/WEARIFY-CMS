"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type CategoryColumn = {
  id: number;
  title: string;
  subcategory: Array<{ title: string }>;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "subcategory",
    header: "Sub category",
    cell: ({ row }) =>
      row.original.subcategory.map((sub) => (
        <Badge key={sub.title}>{sub.title}</Badge>
      )),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
