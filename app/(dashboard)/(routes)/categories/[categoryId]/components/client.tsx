"use client"

import { Category } from "@/db/schema"

import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// import { AddCategoryDialog } from "./category-dialog"
import { columns, SubcategoryColumn } from "./columns"

interface CategoryClientProps {
  category: Category | undefined
  subcategories: SubcategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
  category,
  subcategories,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={"Update category"}
          description="Update this category information"
        />
        {/* <AddCategoryDialog /> */}
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <Heading
          title={`Subcategories (${subcategories.length})`}
          description="Manage categories for your store"
        />
        {/* <AddCategoryDialog /> */}
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={subcategories} />
      <Heading title="API" description="API Calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  )
}
