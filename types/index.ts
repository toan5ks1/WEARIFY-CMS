import type { Store } from "@/db/schema"
import { type FileWithPath } from "react-dropzone"
import type Stripe from "stripe"
import { z } from "zod"

import {
  type cartItemSchema,
  type checkoutItemSchema,
} from "@/lib/validations/cart"
import { categorySchema } from "@/lib/validations/category"
import { subcategorySchema } from "@/lib/validations/subcategory"

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface StoredFile {
  id: string
  name: string
  url: string
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export interface CuratedStore {
  id: Store["id"]
  name: Store["name"]
  description?: Store["description"]
  stripeAccountId?: Store["stripeAccountId"]
  productCount?: number
}

export type CartItem = z.infer<typeof cartItemSchema>

export type CheckoutItem = z.infer<typeof checkoutItemSchema>

export type StripePaymentStatus = Stripe.PaymentIntent.Status

export interface SubscriptionPlan {
  id: "basic" | "standard" | "pro"
  name: string
  description: string
  features: string[]
  stripePriceId: string
  price: number
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeSubscriptionId?: string | null
  stripeCurrentPeriodEnd?: string | null
  stripeCustomerId?: string | null
  isSubscribed: boolean
  isCanceled: boolean
  isActive: boolean
}

export type FileWithPreview = FileWithPath & {
  preview: string
}

export interface Dimension {
  w: number | null
  h: number | null
  x: number | null
  y: number | null
}

export interface Side {
  title: string
  description?: string
  slug: string
  dimension: Dimension[] | null
  areaType: "image" | "dimension"
  subcategoryId: number
  mockup: StoredFile | null
  areaImage: StoredFile | null
}

export interface InputCategory extends z.infer<typeof categorySchema> {}

export interface InputUpdateCategory extends z.infer<typeof categorySchema> {
  id: number
}

export interface InputSubcategory extends z.infer<typeof subcategorySchema> {
  id?: number
}

export interface InputUpdateSubcategory
  extends z.infer<typeof subcategorySchema> {
  id: number
}
