/*
  Warnings:

  - A unique constraint covering the columns `[extension]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_extension_key" ON "Link"("extension");
