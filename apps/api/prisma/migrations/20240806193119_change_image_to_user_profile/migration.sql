/*
  Warnings:

  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `image`;

-- AlterTable
ALTER TABLE `userprofile` ADD COLUMN `image` VARCHAR(500) NULL;
