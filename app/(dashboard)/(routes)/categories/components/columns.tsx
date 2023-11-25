"use client"

import { Category } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "./cell-action"

export type CategoryColumn = Category & {
  subcategories: {
    title: string
  }[]
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "subcategory",
    header: "Sub category",
    cell: ({ row }) =>
      row.original.subcategories.map((sub) => (
        <Badge key={sub.title} className="mx-0.5">
          {sub.title}
        </Badge>
      )),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(row.original.createdAt!, "MMMM do, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
