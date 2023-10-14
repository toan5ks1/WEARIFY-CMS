import type { CartItem, CheckoutItem, StoredFile } from "@/types";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  slug: text("slug"),
  active: boolean("active").notNull().default(false),
  isFeatured: boolean("isFeatured").notNull().default(false),
  stripeAccountId: varchar("stripeAccountId", { length: 191 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  payments: many(payments),
}));

export const categories = mysqlTable("category", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 191 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Category = typeof categories.$inferSelect;

export const categoryRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
}));

export const subcategories = mysqlTable("sub_category", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 191 }).notNull(),
  description: text("description"),
  image: json("image").$type<StoredFile | null>().default(null),
  slug: varchar("slug", { length: 191 }),
  categoryId: int("categoryId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Subcategory = typeof subcategories.$inferSelect;

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    products: many(products),
    size: many(size),
    side: many(side),
  })
);

export const side = mysqlTable("side", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 191 }).notNull(),
  description: text("description"),
  image: json("image").$type<StoredFile | null>().default(null),
  printArea: json("printArea").$type<StoredFile | null>().default(null),
  subcategoryId: int("subcategoryId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  subcategoryId: int("subcategoryId").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  inventory: int("inventory").notNull().default(0),
  rating: int("rating").notNull().default(0),
  tags: json("tags").$type<string[] | null>().default(null),
  isFeatured: boolean("isFeatured").default(false),
  storeId: int("storeId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  size: many(size),
  color: many(color),
}));

export const size = mysqlTable("size", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  value: varchar("value", { length: 191 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Size = typeof size.$inferSelect;

export const color = mysqlTable("color", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  value: varchar("value", { length: 191 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Color = typeof color.$inferSelect;

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  paymentIntentId: varchar("paymentIntentId", { length: 191 }),
  clientSecret: varchar("clientSecret", { length: 191 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }),
  email: varchar("email", { length: 191 }).notNull(),
  token: varchar("token", { length: 191 }).notNull(),
  newsletter: boolean("newsletter").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  transactional: boolean("transactional").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type EmailPreference = typeof emailPreferences.$inferSelect;
export type NewEmailPreference = typeof emailPreferences.$inferInsert;

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  stripeAccountId: varchar("stripeAccountId", { length: 191 }).notNull(),
  stripeAccountCreatedAt: int("stripeAccountCreatedAt"),
  stripeAccountExpiresAt: int("stripeAccountExpiresAt"),
  detailsSubmitted: boolean("detailsSubmitted").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export const paymentsRelations = relations(payments, ({ one }) => ({
  store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
}));

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  items: json("items").$type<CheckoutItem[] | null>().default(null),
  quantity: int("quantity"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", {
    length: 191,
  }).notNull(),
  stripePaymentIntentStatus: varchar("stripePaymentIntentStatus", {
    length: 191,
  }).notNull(),
  name: varchar("name", { length: 191 }),
  email: varchar("email", { length: 191 }),
  addressId: int("addressId"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const addresses = mysqlTable("addresses", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 191 }),
  line2: varchar("line2", { length: 191 }),
  city: varchar("city", { length: 191 }),
  state: varchar("state", { length: 191 }),
  postalCode: varchar("postalCode", { length: 191 }),
  country: varchar("country", { length: 191 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
