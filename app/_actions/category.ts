"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
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

export async function updateCategory1Action(
  input: z.infer<typeof categorySchema> & {
    id: number;
  }
) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, input.id),
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  await db.update(categories).set(input).where(eq(categories.id, input.id));

  revalidatePath("/categories");
}
