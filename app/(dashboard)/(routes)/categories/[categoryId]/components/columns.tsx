"use client"

import { Subcategory } from "@/db/schema"
import { Side } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"

import { CellAction } from "./cell-action"

export type SubcategoryColumn = Omit<Subcategory, "images"> & {
  sides: {
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
    accessorKey: "sides",
    header: "Print side",
    cell: ({ row }) =>
      row.original.sides.map((side) => (
        <Badge key={side.title}>{side.title}</Badge>
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
