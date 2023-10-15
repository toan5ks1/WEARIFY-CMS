import { db } from "@/db"
import { categories, subcategories } from "@/db/schema"
import { eq } from "drizzle-orm"

import { CategoryClient } from "./components/client"
import { Separator } from "@/components/ui/separator"
import { UpdateCategoryForm } from "./components/category-form"
import { notFound } from "next/navigation"

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
      image: false,
    },
    with: {
      side: {
        columns: {
          title: true,
        },
      },
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UpdateCategoryForm category={category}/>
        <Separator />
        <CategoryClient subcategories={allSubcategory} />
      </div>
    </div>
  )
}

export default CategoryPage
