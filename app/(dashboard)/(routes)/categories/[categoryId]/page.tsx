import { notFound } from "next/navigation"
import { db } from "@/db"
import { categories, subcategories } from "@/db/schema"
import { eq } from "drizzle-orm"

import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { UpdateCategoryForm } from "./components/category-form"
import { columns } from "./components/columns"
import { AddSubcategoryDialog } from "./components/subcategory-dialog"

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const categoryId = Number(params.categoryId)
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  })

  if (!category) {
    notFound()
  }
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
        <UpdateCategoryForm category={category} />
        <Separator />
        <Heading title="API" description="API Calls for Categories" />
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId" />
      </div>
    </div>
  )
}

export default CategoryPage
