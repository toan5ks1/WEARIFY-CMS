"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Modal } from "@/components/ui/modal"
import { AlertModal } from "@/components/modals/alert-modal"
import { deleteSubcategoryAction } from "@/app/_actions/subcategory"

import { SubcategoryColumn } from "./columns"

interface CellActionProps {
  data: SubcategoryColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onConfirm = async () => {
    try {
      setLoading(true)
      await deleteSubcategoryAction({
        id: data.id,
        categoryId: data.categoryId,
      })

      toast.success("Subcategory deleted successfully.")
      router.push(`/categories/${data.categoryId}`)
      router.refresh()
    } catch (err) {
      catchError(err)
    }
  }

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString())
    toast.success("Subcategory ID copied to clipboard.")
  }

  return (
    <>
      <DropdownMenu>
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
          <DropdownMenuItem
            onClick={() => router.push(`/categories/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onConfirm}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
