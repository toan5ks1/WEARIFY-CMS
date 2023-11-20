"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { sides } from "@/db/schema"
import { Side } from "@/types"

export async function addSideAction(input: Side[]) {
  input && (await db.insert(sides).values(input))

  revalidatePath("/categories")
}
