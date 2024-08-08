/*
  Warnings:

  - You are about to alter the column `ticketType` on the `event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(0))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `statusEvent` ENUM('AVAILABLE', 'SOLD_OUT', 'ENDED') NULL,
    MODIFY `ticketType` ENUM('PAID', 'FREE') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL;
