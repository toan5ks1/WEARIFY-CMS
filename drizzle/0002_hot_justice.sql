CREATE TABLE `side` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL,
	`description` text,
	`image` json DEFAULT ('null'),
	`printArea` json DEFAULT ('null'),
	`subcategoryId` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `side_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `subcategoryId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `sub_category` ADD `image` json DEFAULT ('null');--> statement-breakpoint
ALTER TABLE `category` DROP COLUMN `images`;--> statement-breakpoint
ALTER TABLE `category` DROP COLUMN `icon`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `subcategory`;--> statement-breakpoint
ALTER TABLE `sub_category` DROP COLUMN `images`;--> statement-breakpoint
ALTER TABLE `sub_category` DROP COLUMN `icon`;