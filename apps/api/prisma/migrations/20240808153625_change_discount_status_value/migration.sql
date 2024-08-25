/*
  Warnings:

  - Made the column `codeStatus` on table `discountcode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `discountcode` MODIFY `codeStatus` ENUM('USED', 'AVAILABLE') NOT NULL;
