CREATE TABLE `colors` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `colors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sides` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL,
	`description` text,
	`image` json DEFAULT ('null'),
	`printArea` json DEFAULT ('null'),
	`subcategoryId` int NOT NULL,
	`productId` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sizes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sizes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `color`;--> statement-breakpoint
DROP TABLE `side`;--> statement-breakpoint
DROP TABLE `size`;