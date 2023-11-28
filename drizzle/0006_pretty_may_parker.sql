ALTER TABLE `sub_category` MODIFY COLUMN `slug` text;--> statement-breakpoint
ALTER TABLE `sides` ADD `areaImage` json DEFAULT ('null');--> statement-breakpoint
ALTER TABLE `sides` ADD `dimension` json DEFAULT ('null');--> statement-breakpoint
ALTER TABLE `sides` ADD `areaType` enum('image','dimension') DEFAULT 'image';--> statement-breakpoint
ALTER TABLE `sides` DROP COLUMN `printArea`;--> statement-breakpoint
ALTER TABLE `sides` DROP COLUMN `productId`;