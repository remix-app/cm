CREATE TABLE `commonExpenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`propertyId` int NOT NULL,
	`period` date NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`baseAmount` decimal(10,2) NOT NULL,
	`serviceCharge` decimal(10,2) NOT NULL DEFAULT '0',
	`dueDate` date NOT NULL,
	`status` enum('pending','paid','overdue','partial') NOT NULL DEFAULT 'pending',
	`paidAt` timestamp,
	`paidAmount` decimal(10,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commonExpenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`city` varchar(100),
	`country` varchar(2) NOT NULL DEFAULT 'CL',
	`taxId` varchar(50),
	`adminId` int NOT NULL,
	`logo` text,
	`settings` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`url` text NOT NULL,
	`category` varchar(100),
	`uploadedBy` int NOT NULL,
	`size` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenseItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commonExpenseId` int NOT NULL,
	`category` enum('operating','maintenance','salary','insurance','fund','other') NOT NULL,
	`description` text NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`type` enum('fixed','variable','percentage') NOT NULL DEFAULT 'fixed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenseItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`description` text NOT NULL,
	`vendor` varchar(255),
	`category` varchar(100) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentDate` date NOT NULL,
	`status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
	`invoiceNumber` varchar(100),
	`invoiceUrl` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('fixed','percentage') NOT NULL,
	`amount` decimal(10,2),
	`percentage` decimal(5,2),
	`balance` decimal(10,2) NOT NULL DEFAULT '0',
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `funds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`propertyId` int,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`reportedBy` int NOT NULL,
	`assignedTo` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insurances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`propertyId` int,
	`policyNumber` varchar(100) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`coverage` text,
	`premium` decimal(10,2) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`documentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insurances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`propertyId` int NOT NULL,
	`carrier` varchar(100),
	`trackingNumber` varchar(100),
	`receivedBy` int NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`pickedUpBy` int,
	`pickedUpAt` timestamp,
	`status` enum('pending','picked_up') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commonExpenseId` int NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` varchar(50) NOT NULL,
	`transactionId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`unitNumber` varchar(50) NOT NULL,
	`floor` int,
	`area` decimal(10,2),
	`ownerId` int,
	`tenantId` int,
	`type` enum('apartment','house','commercial','parking','storage') NOT NULL DEFAULT 'apartment',
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`authorId` int NOT NULL,
	`category` varchar(100),
	`isPinned` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`propertyId` int NOT NULL,
	`visitorName` varchar(255) NOT NULL,
	`visitorId` varchar(50),
	`visitDate` timestamp NOT NULL,
	`authorizedBy` int NOT NULL,
	`checkInAt` timestamp,
	`checkOutAt` timestamp,
	`status` enum('scheduled','checked_in','checked_out','cancelled') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `votationOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`votationId` int NOT NULL,
	`optionText` varchar(255) NOT NULL,
	`voteCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `votationOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `votations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`status` enum('draft','active','closed') NOT NULL DEFAULT 'draft',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `votations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`votationId` int NOT NULL,
	`optionId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','resident','tenant','accountant') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);