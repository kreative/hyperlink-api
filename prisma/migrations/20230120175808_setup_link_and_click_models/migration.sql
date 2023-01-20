/*
  Warnings:

  - You are about to drop the column `code` on the `Link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[extension]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `extension` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Link_code_key";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "code",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "ghost" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ksn" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Click" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "continentCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitute" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "linkId" INTEGER NOT NULL,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_extension_key" ON "Link"("extension");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
