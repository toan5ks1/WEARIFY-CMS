"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { Side, sides } from "@/db/schema"

export async function addSideAction(input: Side) {
  input && (await db.insert(sides).values(input))

  revalidatePath("/categories")
}
