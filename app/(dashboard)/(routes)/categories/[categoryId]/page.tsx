import { eq } from "drizzle-orm";
import { CategoryForm } from "./components/category-form";
import { db } from "@/db";
import { category, subcategory } from "@/db/schema";

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const categoryId = Number(params.categoryId) || -1;
  const targetCategory = await db.query.category.findFirst({
    where: eq(category.id, categoryId),
  });

  const targetSubcategory = await db.query.subcategory.findMany({
    where: eq(subcategory.categoryId, categoryId),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          initialData={targetCategory}
          subcategory={targetSubcategory}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
