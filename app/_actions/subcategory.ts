"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { categories, sides, subcategories } from "@/db/schema"
import { InputSubcategory, InputUpdateSubcategory, StoredFile } from "@/types"
import { and, eq, not, or } from "drizzle-orm"

export async function checkAddSubcategoryAction(input: {
  title: string
  categoryId: number
}) {
  const subcategoryWithSameName = await db.query.subcategories.findFirst({
    where: and(
      eq(subcategories.categoryId, input.categoryId),
      eq(subcategories.title, input.title)
    ),
  })

  if (subcategoryWithSameName) {
    throw new Error("Subcategory name already taken.")
  }
}

export async function checkUpdateSubcategoryAction(input: {
  title: string
  categoryId: number
  id: number
}) {
  const subcategoryWithSameName = await db.query.subcategories.findFirst({
    where: and(
      and(
        eq(subcategories.categoryId, input.categoryId),
        eq(subcategories.title, input.title)
      ),
      not(eq(subcategories.id, input.id))
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
  input: Omit<InputUpdateSubcategory, "sides"> & {
    categoryId: number
    images: StoredFile | null
  }
) {
  const subcategory = await db.query.subcategories.findFirst({
    where: eq(subcategories.id, input.id),
  })

  if (!subcategory) {
    throw new Error("Subcategory not found!")
  }

  await db
    .update(subcategories)
    .set(input)
    .where(eq(subcategories.id, input.id))

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
