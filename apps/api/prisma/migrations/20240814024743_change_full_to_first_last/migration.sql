/*
  Warnings:

  - You are about to drop the column `fullName` on the `userprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `userprofile` DROP COLUMN `fullName`,
    ADD COLUMN `firstName` VARCHAR(255) NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NULL,
    ADD COLUMN `lastName` VARCHAR(255) NULL;
