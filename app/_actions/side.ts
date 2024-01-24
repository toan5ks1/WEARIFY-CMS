"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { sides } from "@/db/schema"
import { Side, UpdateSide } from "@/types"
import { eq } from "drizzle-orm"

export async function addSideAction(input: Side[]) {
  input && (await db.insert(sides).values(input))
}

export async function updateSideAction(input: UpdateSide) {
  const side = await db.query.sides.findFirst({
    where: eq(sides.id, input.id),
  })

  if (!side) {
    throw new Error(`Update ${input.title ?? "side"} error (side not found)!`)
  }

  await db.update(sides).set(input).where(eq(sides.id, input.id))
}

export async function revSubcategory(categoryId: number) {
  revalidatePath(`/categories/${categoryId}`)
}
