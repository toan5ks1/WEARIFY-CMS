import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import { categories } from "@/db/schema";

const CategoriesPage = async () => {
  const allCategories = await db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
    with: {
      subcategories: {
        columns: {
          title: true,
        },
      },
    },
  });

  const formattedCategories: CategoryColumn[] = allCategories.map((item) => ({
    id: item.id,
    title: item.title,
    subcategory: item.subcategories,
    image: "billboard",
    icon: "billboard",
    createdAt: format(item.createdAt!, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
