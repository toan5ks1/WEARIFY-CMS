"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { or, eq, not } from "drizzle-orm";
import { type z } from "zod";

import type { categorySchema } from "@/lib/validations/category";

export async function addCategoryAction(input: z.infer<typeof categorySchema>) {
  const categoryWithSameName = await db.query.categories.findFirst({
    where: eq(categories.title, input.title),
  });

  if (categoryWithSameName) {
    throw new Error("Category name already taken.");
  }

  await db.insert(categories).values({
    title: input.title,
    description: input.description,
  });

  revalidatePath("/categories");
}

export async function updateCategoryAction(
  input: z.infer<typeof categorySchema> & {
    id: number;
  }
) {
  const category = await db.query.categories.findMany({
    where: or(eq(categories.id, input.id), eq(categories.title, input.title)),
  });

  console.log(input.id)

  let msg;
  switch(category.length){
    case 0:
      msg = "Category not found"
      break;
    case 1:
      if(category[0].id !== input.id) {
        msg = "Category not found"
      }
      break;
    case 2:
      msg = "Store name already taken"
      break;
    default:
      break;
  }
  if (!category) {
    throw new Error();
  }

  if (msg) {
    throw new Error(msg)
  }

  await db.update(categories).set(input).where(eq(categories.id, input.id));

  revalidatePath("/categories");
}

// async function deleteStore() {
//   "use server"

//   const store = await db.query.stores.findFirst({
//     where: eq(stores.id, storeId),
//     columns: {
//       id: true,
//     },
//   })

//   if (!store) {
//     throw new Error("Store not found")
//   }

//   await db.delete(stores).where(eq(stores.id, storeId))

//   // Delete all products of this store
//   await db.delete(products).where(eq(products.storeId, storeId))

//   const path = "/dashboard/stores"
//   revalidatePath(path)
//   redirect(path)
// }