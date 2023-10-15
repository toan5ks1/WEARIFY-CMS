"use client"

import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// import { AddCategoryDialog } from "./category-dialog"
import { columns, SubcategoryColumn } from "./columns"

interface CategoryClientProps {
  subcategories: SubcategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  subcategories,
}) => {
  return (
    <>
      <Heading
        title={`Subcategories (${subcategories.length})`}
        description="Manage subcategories for your store"
      />
      <Separator />
      <DataTable searchKey="title" columns={columns} data={subcategories} />
      <Heading title="API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  )
}
