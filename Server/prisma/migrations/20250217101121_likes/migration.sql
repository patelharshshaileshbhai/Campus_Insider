/*
  Warnings:

  - You are about to drop the column `number` on the `likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `likes` DROP COLUMN `number`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `numbersOfLikes` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
