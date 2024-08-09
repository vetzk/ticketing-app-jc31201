-- AlterTable
ALTER TABLE `event` MODIFY `paymentMethod` VARCHAR(191) NULL,
    MODIFY `paymentCost` DOUBLE NULL,
    MODIFY `image` VARCHAR(191) NULL,
    MODIFY `views` INTEGER NOT NULL DEFAULT 0,
    MODIFY `visitorsThisMonth` INTEGER NOT NULL DEFAULT 0,
    MODIFY `visitorsLastMonth` INTEGER NOT NULL DEFAULT 0,
    MODIFY `visitorsThisWeek` INTEGER NOT NULL DEFAULT 0,
    MODIFY `visitorsLastWeek` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `referralCode` VARCHAR(191) NULL,
    `referredBy` INTEGER NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `role` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
