import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.orders.findMany({
    where: {
      storeId: parseInt(storeId),
      stripePaymentIntentStatus: "succeeded",
    },
  });
  const totalRevenue = 10;
  // const totalRevenue = paidOrders.reduce((total, order) => {
  //   const orderTotal = JSON.parse(order.items).reduce((orderSum, item) => {
  //     return orderSum + item.product.price.toNumber();
  //   }, 0);
  //   return total + orderTotal;
  // }, 0);

  return totalRevenue;
};
