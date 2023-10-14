"use client"

import { Subcategory } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "./cell-action"

export type SubcategoryColumn = Omit<Subcategory, "image"> & {
  side: {
    title: string
  }[]
}

export const columns: ColumnDef<SubcategoryColumn>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "side",
    header: "Print side",
    cell: ({ row }) =>
      row.original.side.map((sub) => (
        <Badge key={sub.title}>{sub.title}</Badge>
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
