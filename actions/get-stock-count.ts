import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
  const stockCount = await prismadb.products.count({
    where: {
      storeId: parseInt(storeId),
    },
  });

  return stockCount;
};
