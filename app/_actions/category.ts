"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { categories } from "@/db/schema"
import { eq, or } from "drizzle-orm"
import { type z } from "zod"

import type { categorySchema } from "@/lib/validations/category"

export async function addCategoryAction(input: z.infer<typeof categorySchema>) {
  await db.insert(categories).values({
    title: input.title,
    description: input.description,
  })

  revalidatePath("/categories")
}

export async function updateCategoryAction(
  input: z.infer<typeof categorySchema> & {
    id: number
  }
) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, input.id),
  })

  if (!category) {
    throw new Error("Category not found!")
  }

  await db.update(categories).set(input).where(eq(categories.id, input.id))

  revalidatePath(`/categories/${input.id}`)
}

export async function deleteCategoryAction({ id }: { id: number }) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
    columns: {
      id: true,
    },
    with: {
      subcategories: {
        columns: {
          id: true,
        },
      },
    },
  })

  if (!category) {
    throw new Error("Store not found")
  }

  if (category.subcategories.length) {
    throw new Error(
      "Make sure you removed all subcategory using this category first"
    )
  }

  await db.delete(categories).where(eq(categories.id, id))

  revalidatePath("/categories")
}
