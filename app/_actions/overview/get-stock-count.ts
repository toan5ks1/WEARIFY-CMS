import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";

export const getStockCount = async () => {
  const stockCount = await db
    .select({ count: sql<number>`cast(count(*) as UNSIGNED)` })
    .from(products);

  return stockCount[0].count;
};
