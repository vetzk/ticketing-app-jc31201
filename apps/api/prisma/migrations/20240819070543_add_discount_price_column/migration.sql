/*
  Warnings:

  - Added the required column `discountTotal` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `discountTotal` INTEGER NOT NULL;
