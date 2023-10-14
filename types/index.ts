import type { Product, Store } from "@/db/schema";
import {
  type cartItemSchema,
  type checkoutItemSchema,
} from "@/lib/validations/cart";
import type Stripe from "stripe";
import { type FileWithPath } from "react-dropzone";
import { z } from "zod";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface StoredFile {
  id: string;
  name: string;
  url: string;
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

export interface Category {
  title: Product["category"];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Subcategory {
  title: string;
  description?: string;
  image?: string;
  slug: string;
}

export interface CuratedStore {
  id: Store["id"];
  name: Store["name"];
  description?: Store["description"];
  stripeAccountId?: Store["stripeAccountId"];
  productCount?: number;
}

export type CartItem = z.infer<typeof cartItemSchema>;

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;

export type StripePaymentStatus = Stripe.PaymentIntent.Status;

export interface SubscriptionPlan {
  id: "basic" | "standard" | "pro";
  name: string;
  description: string;
  features: string[];
  stripePriceId: string;
  price: number;
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeSubscriptionId?: string | null;
  stripeCurrentPeriodEnd?: string | null;
  stripeCustomerId?: string | null;
  isSubscribed: boolean;
  isCanceled: boolean;
  isActive: boolean;
}

export type FileWithPreview = FileWithPath & {
  preview: string;
};
