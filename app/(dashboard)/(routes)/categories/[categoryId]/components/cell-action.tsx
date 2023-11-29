"use client"

import { useState } from "react"
import { Sides, Subcategory } from "@/db/schema"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertModal } from "@/components/modals/alert-modal"
import {
  deleteSubcategoryAction,
  getSubcategory,
} from "@/app/_actions/subcategory"

import { SubcategoryColumn } from "./columns"
import { UpdateSubcategoryDialog } from "./update-subcategory-dialog"

interface CellActionProps {
  data: SubcategoryColumn
}

export interface SubcategoryWithSides extends Subcategory {
  sides: Sides[]
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [subcategory, setSubcategory] = useState<
    SubcategoryWithSides | undefined
  >(undefined)

  const onUpdateFormOpen = async (subcategoryId: number) => {
    const subcategory = await getSubcategory(subcategoryId)

    setSubcategory(subcategory)
  }

  const onConfirm = async () => {
    try {
      await deleteSubcategoryAction({
        id: data.id,
        categoryId: data.categoryId,
      })

      toast.success("Subcategory deleted successfully.")
    } catch (err) {
      catchError(err)
    }
  }

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString())
    toast.success("Subcategory ID copied to clipboard.")
  }

  return (
    <Dialog onOpenChange={() => onUpdateFormOpen(data.id)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          </DialogTrigger>
          <AlertModal onConfirm={onConfirm}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </AlertModal>
        </DropdownMenuContent>
        <UpdateSubcategoryDialog
          categoryId={data.categoryId}
          data={subcategory}
        />
      </DropdownMenu>
    </Dialog>
  )
}
