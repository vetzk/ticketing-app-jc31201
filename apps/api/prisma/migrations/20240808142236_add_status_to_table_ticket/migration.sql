/*
  Warnings:

  - Added the required column `status` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `status` ENUM('PAID', 'UNPAID') NOT NULL;
