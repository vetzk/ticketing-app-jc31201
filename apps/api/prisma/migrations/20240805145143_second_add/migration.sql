/*
  Warnings:

  - You are about to drop the `referral` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `points` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `referral` DROP FOREIGN KEY `Referral_fk1`;

-- DropForeignKey
ALTER TABLE `referral` DROP FOREIGN KEY `Referral_fk2`;

-- AlterTable
ALTER TABLE `discountcode` MODIFY `validFrom` DATE NOT NULL,
    MODIFY `validTo` DATE NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `points` INTEGER NOT NULL,
    ADD COLUMN `referredBy` INTEGER NULL;

-- DropTable
DROP TABLE `referral`;

-- CreateTable
CREATE TABLE `point` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `validFrom` DATETIME(0) NOT NULL,
    `validTo` DATETIME(0) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id`(`id`),
    INDEX `Point_fk1`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `User_fk5` ON `user`(`referredBy`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_fk5` FOREIGN KEY (`referredBy`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `Point_fk1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
