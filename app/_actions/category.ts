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
  const category = await db.query.categories.findMany({
    where: or(eq(categories.id, input.id), eq(categories.title, input.title)),
  })

  let msg
  switch (category.length) {
    case 0:
      msg = "Category not found"
      break
    case 1:
      if (category[0].id !== input.id) {
        msg = "Category not found"
      }
      break
    case 2:
      msg = "Category name already taken"
      break
    default:
      break
  }

  if (msg) {
    throw new Error(msg)
  }

  await db.update(categories).set(input).where(eq(categories.id, input.id))

  revalidatePath("/categories")
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
