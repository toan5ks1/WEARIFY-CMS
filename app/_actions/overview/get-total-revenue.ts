import { db } from "@/db";
import { orders } from "@/db/schema";
import { CheckoutItem } from "@/types";
import { eq } from "drizzle-orm";

export const getTotalRevenue = async () => {
  const paidOrders = await db.query.orders.findMany({
    where: eq(orders.stripePaymentIntentStatus, "succeeded"),
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.items
      ? JSON.parse(order.items.toString()).reduce(
          (orderSum: number, item: CheckoutItem) => {
            return orderSum + item.price;
          },
          0
        )
      : 0;
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
