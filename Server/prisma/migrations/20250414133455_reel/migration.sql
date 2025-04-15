/*
  Warnings:

  - You are about to drop the column `description` on the `Reel` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Reel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reel" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "caption" TEXT;
