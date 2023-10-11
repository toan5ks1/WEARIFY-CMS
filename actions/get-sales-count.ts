import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismadb.orders.count({
    where: {
      stripePaymentIntentStatus: "succeeded",
    },
  });

  return salesCount;
};
