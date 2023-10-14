import { db } from "@/db"
import { categories, subcategories } from "@/db/schema"
import { eq } from "drizzle-orm"

import { CategoryClient } from "./components/client"

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const categoryId = Number(params.categoryId)
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  })
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
        <CategoryClient category={category} subcategories={allSubcategory} />
      </div>
    </div>
  )
}

export default CategoryPage
