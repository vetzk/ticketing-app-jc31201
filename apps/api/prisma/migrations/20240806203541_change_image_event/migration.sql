/*
  Warnings:

  - You are about to alter the column `image` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `image` VARCHAR(191) NULL;
