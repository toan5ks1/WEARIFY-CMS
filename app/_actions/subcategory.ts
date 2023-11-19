"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { subcategories } from "@/db/schema"
import { StoredFile } from "@/types"
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
  input: z.infer<typeof subcategorySchema> & {
    categoryId: number
    images: StoredFile | null
  }
) {
  const result = await db.insert(subcategories).values({
    categoryId: input.categoryId,
    title: input.title,
    description: input.description,
    images: input.images,
  })

  revalidatePath(`/categories/${input.categoryId}`)

  return result.insertId
}

// export async function updateCategoryAction(
//   input: z.infer<typeof categorySchema> & {
//     id: number;
//   }
// ) {
//   const category = await db.query.categories.findMany({
//     where: or(eq(categories.id, input.id), eq(categories.title, input.title)),
//   });

//   let msg;
//   switch(category.length){
//     case 0:
//       msg = "Category not found"
//       break;
//     case 1:
//       if(category[0].id !== input.id) {
//         msg = "Category not found"
//       }
//       break;
//     case 2:
//       msg = "Category name already taken"
//       break;
//     default:
//       break;
//   }

//   if (msg) {
//     throw new Error(msg)
//   }

//   await db.update(categories).set(input).where(eq(categories.id, input.id));

//   revalidatePath("/categories");
// }

// export async function deleteCategoryAction({id}: {id: number}) {
//   const category = await db.query.categories.findFirst({
//     where: eq(categories.id, id),
//     columns: {
//       id: true,
//     },
//     with: {
//       subcategories: {
//         columns: {
//           id: true,
//         },
//       }
//     }
//   })

//   if (!category) {
//     throw new Error("Store not found")
//   }

//   if (category.subcategories.length) {
//     throw new Error("Make sure you removed all subcategory using this category first")
//   }

//   await db.delete(categories).where(eq(categories.id, id))

//   revalidatePath("/categories")
// }
