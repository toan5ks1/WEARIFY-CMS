CREATE TABLE `addresses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`line1` varchar(191),
	`line2` varchar(191),
	`city` varchar(191),
	`state` varchar(191),
	`postalCode` varchar(191),
	`country` varchar(191),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`paymentIntentId` varchar(191),
	`clientSecret` varchar(191),
	`items` json DEFAULT ('null'),
	`closed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`images` json DEFAULT ('null'),
	`icon` varchar(191),
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `color` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `color_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_preferences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191),
	`email` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`newsletter` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`transactional` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `email_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`items` json DEFAULT ('null'),
	`quantity` int,
	`amount` decimal(10,2) NOT NULL DEFAULT '0',
	`stripePaymentIntentId` varchar(191) NOT NULL,
	`stripePaymentIntentStatus` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`addressId` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`stripeAccountId` varchar(191) NOT NULL,
	`stripeAccountCreatedAt` int,
	`stripeAccountExpiresAt` int,
	`detailsSubmitted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`images` json DEFAULT ('null'),
	`category` varchar(191) NOT NULL,
	`subcategory` varchar(191) NOT NULL,
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`inventory` int NOT NULL DEFAULT 0,
	`rating` int NOT NULL DEFAULT 0,
	`tags` json DEFAULT ('null'),
	`isFeatured` boolean DEFAULT false,
	`storeId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `size` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `size_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`slug` text,
	`active` boolean NOT NULL DEFAULT false,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`stripeAccountId` varchar(191),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sub_category` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL,
	`description` text,
	`images` json DEFAULT ('null'),
	`slug` varchar(191),
	`icon` varchar(191),
	`categoryId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sub_category_id` PRIMARY KEY(`id`)
);
