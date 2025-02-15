/*
  Warnings:

  - You are about to drop the column `authorName` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `authorDetail` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `authorName`,
    ADD COLUMN `authorDetail` JSON NOT NULL;
