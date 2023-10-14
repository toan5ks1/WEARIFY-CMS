import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, subcategories } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateCategoryForm } from "./components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const categoryId = Number(params.categoryId);
  // const category = await db.query.categories.findFirst({
  //   where: eq(categories.id, categoryId),
  // });
  // const subcategory = await db.query.subcategories.findMany({
  //   where: eq(subcategories.categoryId, categoryId),
  // });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Update categories</CardTitle>
        <CardDescription>Update a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateCategoryForm
        // initialData={targetCategory}
        // subcategories={targetSubcategory}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryPage;
