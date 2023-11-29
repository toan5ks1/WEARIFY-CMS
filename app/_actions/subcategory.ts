"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { sides, subcategories } from "@/db/schema"
import { InputSubcategory, StoredFile } from "@/types"
import { and, eq, not, or } from "drizzle-orm"
import { type z } from "zod"

import type { subcategorySchema } from "@/lib/validations/subcategory"

export async function checkSubcategoryAction(input: {
  title: string
  categoryId: number
  id?: number
}) {
  const subcategoryWithSameName = await db.query.subcategories.findFirst({
    where: input.id
      ? and(
          not(eq(subcategories.id, input.id)),
          and(
            eq(subcategories.categoryId, input.categoryId),
            eq(subcategories.title, input.title)
          )
        )
      : and(
          eq(subcategories.categoryId, input.categoryId),
          eq(subcategories.title, input.title)
        ),
  })

  if (subcategoryWithSameName) {
    throw new Error("Subcategory name already taken.")
  }
}

export async function addSubcategoryAction(
  input: Omit<InputSubcategory, "sides"> & {
    categoryId: number
    images: StoredFile | null
  }
) {
  const result = await db.insert(subcategories).values(input)

  revalidatePath(`/categories/${input.categoryId}`)

  return result.insertId
}

export async function getSubcategory(id: number) {
  return await db.query.subcategories.findFirst({
    where: eq(subcategories.id, id),
    with: {
      sides: true,
    },
  })
}

export async function updateSubcategoryAction(
  input: Omit<InputSubcategory, "sides"> & {
    categoryId: number
    images: StoredFile | null
  }
) {
  // await checkSubcategoryAction({id: input.id, title: input.title, categoryId: input.categoryId });
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

export async function deleteSubcategoryAction({
  id,
  categoryId,
}: {
  id: number
  categoryId: number
}) {
  const subcategory = await db.query.subcategories.findFirst({
    where: eq(subcategories.id, id),
    columns: {
      id: true,
    },
    with: {
      sides: {
        columns: {
          id: true,
        },
      },
    },
  })

  if (!subcategory) {
    throw new Error("Subcategory not found")
  }

  if (subcategory.sides.length) {
    await db.delete(sides).where(eq(sides.subcategoryId, id))
  }

  await db.delete(subcategories).where(eq(subcategories.id, id))

  revalidatePath(`/categories/${categoryId}`)
}
