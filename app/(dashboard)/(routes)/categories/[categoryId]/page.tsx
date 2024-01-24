import { db } from "@/db"
import { subcategories } from "@/db/schema"
import { eq } from "drizzle-orm"

import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { AddSubcategoryDialog } from "./components/add-subcategory-dialog"
import { columns } from "./components/columns"

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const categoryId = Number(params.categoryId)

  const allSubcategory = await db.query.subcategories.findMany({
    where: eq(subcategories.categoryId, categoryId),
    columns: {
      images: false,
    },
    with: {
      sides: {
        columns: {
          title: true,
        },
      },
    },
  })

  return (
    <div className="flex-col gap-2">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Subcategories (${allSubcategory.length})`}
            description="Manage subcategories for your store"
          />
          <AddSubcategoryDialog categoryId={categoryId} />
        </div>
        <Separator />
        <DataTable searchKey="title" columns={columns} data={allSubcategory} />
        <Heading title="API" description="API Calls for Categories" />
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId" />
      </div>
    </div>
  )
}

export default CategoryPage
