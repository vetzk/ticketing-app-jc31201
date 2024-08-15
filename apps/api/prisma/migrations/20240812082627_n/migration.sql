/*
  Warnings:

  - You are about to drop the column `referredBy` on the `user` table. All the data in the column will be lost.
  - Added the required column `descriptionDetail` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `descriptionDetail` VARCHAR(191) NOT NULL DEFAULT 'No details provided';

-- AlterTable
ALTER TABLE `review` ADD COLUMN `descriptionDetail` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `referredBy`,
    ADD COLUMN `referredById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
