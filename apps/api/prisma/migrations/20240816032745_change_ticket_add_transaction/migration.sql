/*
  Warnings:

  - Added the required column `orderCode` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `discountId` INTEGER NULL,
    ADD COLUMN `orderCode` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `TransactionDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketId` INTEGER NOT NULL,
    `ticketCode` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `TransactionDetail_fk1`(`ticketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Ticket_fk3` ON `ticket`(`discountId`);

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `Ticket_fk3` FOREIGN KEY (`discountId`) REFERENCES `discountcode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `TransactionDetail` ADD CONSTRAINT `TransactionDetail_fk1` FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
