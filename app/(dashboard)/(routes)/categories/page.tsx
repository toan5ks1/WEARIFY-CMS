import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import { category } from "@/db/schema";

const CategoriesPage = async () => {
  const categories = await db.query.category.findMany({
    orderBy: [desc(category.createdAt)],
    with: {
      subcategory: {
        columns: {
          title: true,
        },
      },
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    title: item.title,
    subcategory: item.subcategory,
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
