import { db } from "@/db"

import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { AddCategoryDialog } from "./components/category-dialog"
import { columns } from "./components/columns"

const CategoriesPage = async () => {
  const allCategories = await db.query.categories.findMany({
    // orderBy: [asc(categories.title)],
    with: {
      subcategories: {
        columns: {
          title: true,
        },
      },
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Categories (${allCategories.length})`}
            description="Manage categories for your store"
          />
          <AddCategoryDialog />
        </div>
        <Separator />
        <DataTable searchKey="title" columns={columns} data={allCategories} />
        <Heading title="API" description="API Calls for Categories" />
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId" />
      </div>
    </div>
  )
}

export default CategoriesPage
