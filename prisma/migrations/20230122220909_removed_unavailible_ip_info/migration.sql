/*
  Warnings:

  - You are about to drop the column `browser` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `continentCode` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `deviceType` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `languageCode` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `longitute` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `regionCode` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "browser",
DROP COLUMN "continentCode",
DROP COLUMN "countryCode",
DROP COLUMN "deviceType",
DROP COLUMN "languageCode",
DROP COLUMN "latitude",
DROP COLUMN "longitute",
DROP COLUMN "os",
DROP COLUMN "platform",
DROP COLUMN "regionCode",
DROP COLUMN "zip",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "loc" TEXT,
ADD COLUMN     "postal" TEXT,
ADD COLUMN     "region" TEXT;
