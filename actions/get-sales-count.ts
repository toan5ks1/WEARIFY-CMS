import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getSalesCount = async () => {
  const salesCount = await db
    .select({ count: sql<number>`cast(count(*) as UNSIGNED)` })
    .from(orders)
    .where(eq(orders.stripePaymentIntentStatus, "succeeded"));

  return salesCount[0].count;
};
