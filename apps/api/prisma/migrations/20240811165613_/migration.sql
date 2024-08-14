/*
  Warnings:

  - You are about to drop the column `categoryId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `statusEvent` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `ticketType` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `event` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `identificationId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `tryCount` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `referralCode` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the `blacklisttoken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discountcode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discountusage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventinterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventstatistic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historyuser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `labelevent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `point` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userinterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userprofile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `points` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `discountusage` DROP FOREIGN KEY `DiscountUsage_fk1`;

-- DropForeignKey
ALTER TABLE `discountusage` DROP FOREIGN KEY `DiscountUsage_fk2`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_fk1`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_fk2`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_fk7`;

-- DropForeignKey
ALTER TABLE `eventinterest` DROP FOREIGN KEY `EventInterest_fk1`;

-- DropForeignKey
ALTER TABLE `eventinterest` DROP FOREIGN KEY `EventInterest_fk2`;

-- DropForeignKey
ALTER TABLE `eventstatistic` DROP FOREIGN KEY `EventStatistic_fk1`;

-- DropForeignKey
ALTER TABLE `filter` DROP FOREIGN KEY `Filter_fk1`;

-- DropForeignKey
ALTER TABLE `historyuser` DROP FOREIGN KEY `HistoryUser_fk1`;

-- DropForeignKey
ALTER TABLE `historyuser` DROP FOREIGN KEY `HistoryUser_fk2`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `labelevent` DROP FOREIGN KEY `LabelEvent_fk1`;

-- DropForeignKey
ALTER TABLE `labelevent` DROP FOREIGN KEY `LabelEvent_fk2`;

-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `Point_fk1`;

-- DropForeignKey
ALTER TABLE `seat` DROP FOREIGN KEY `Seat_fk1`;

-- DropForeignKey
ALTER TABLE `testimonial` DROP FOREIGN KEY `Testimonial_fk1`;

-- DropForeignKey
ALTER TABLE `testimonial` DROP FOREIGN KEY `Testimonial_fk2`;

-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_fk1`;

-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_fk2`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_fk5`;

-- DropForeignKey
ALTER TABLE `userinterest` DROP FOREIGN KEY `UserInterest_fk1`;

-- DropForeignKey
ALTER TABLE `userinterest` DROP FOREIGN KEY `UserInterest_fk2`;

-- DropForeignKey
ALTER TABLE `userprofile` DROP FOREIGN KEY `UserProfile_fk1`;

-- DropForeignKey
ALTER TABLE `userprofile` DROP FOREIGN KEY `UserProfile_fk5`;

-- DropIndex
DROP INDEX `id` ON `event`;

-- DropIndex
DROP INDEX `id` ON `user`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `categoryId`,
    DROP COLUMN `endTime`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `locationId`,
    DROP COLUMN `price`,
    DROP COLUMN `startTime`,
    DROP COLUMN `statusEvent`,
    DROP COLUMN `ticketType`,
    DROP COLUMN `userId`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `end` DATETIME(3) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `paymentCost` DOUBLE NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `start` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `visitorsLastMonth` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `visitorsLastWeek` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `visitorsThisMonth` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `visitorsThisWeek` INTEGER NOT NULL DEFAULT 0,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `identificationId`,
    DROP COLUMN `isBlocked`,
    DROP COLUMN `tryCount`,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `referralCode` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `points` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `blacklisttoken`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `discountcode`;

-- DropTable
DROP TABLE `discountusage`;

-- DropTable
DROP TABLE `eventinterest`;

-- DropTable
DROP TABLE `eventstatistic`;

-- DropTable
DROP TABLE `filter`;

-- DropTable
DROP TABLE `historyuser`;

-- DropTable
DROP TABLE `image`;

-- DropTable
DROP TABLE `label`;

-- DropTable
DROP TABLE `labelevent`;

-- DropTable
DROP TABLE `location`;

-- DropTable
DROP TABLE `point`;

-- DropTable
DROP TABLE `seat`;

-- DropTable
DROP TABLE `testimonial`;

-- DropTable
DROP TABLE `ticket`;

-- DropTable
DROP TABLE `userinterest`;

-- DropTable
DROP TABLE `userprofile`;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `voucherApplied` BOOLEAN NOT NULL DEFAULT false,
    `discountAmount` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentHistory` ADD CONSTRAINT `PaymentHistory_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `email` TO `User_email_key`;
