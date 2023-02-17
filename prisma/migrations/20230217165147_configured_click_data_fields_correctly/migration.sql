/*
  Warnings:

  - You are about to drop the column `isBot` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "isBot",
DROP COLUMN "platform",
DROP COLUMN "source",
ADD COLUMN     "ua" TEXT;
