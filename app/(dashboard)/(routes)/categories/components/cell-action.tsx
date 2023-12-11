"use client"

import { useRouter } from "next/navigation"
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
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
import { deleteCategoryAction } from "@/app/_actions/category"

import { CategoryColumn } from "./columns"
import { UpdateCategoryDialog } from "./update-category-dialog"

interface CellActionProps {
  data: CategoryColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()

  const onConfirm = async () => {
    try {
      await deleteCategoryAction({ id: data.id })

      toast.success("Category deleted successfully.")
    } catch (err) {
      catchError(err)
    }
  }

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString())
    toast.success("Category ID copied to clipboard.")
  }

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/categories/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
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
        <UpdateCategoryDialog category={data} />
      </DropdownMenu>
    </Dialog>
  )
}
