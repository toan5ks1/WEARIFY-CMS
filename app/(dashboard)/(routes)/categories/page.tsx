import { db } from "@/db"

import { CategoriesClient } from "./components/client"

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
        <CategoriesClient data={allCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage
