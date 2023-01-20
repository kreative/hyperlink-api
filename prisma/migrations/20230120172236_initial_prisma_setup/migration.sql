-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "target" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_code_key" ON "Link"("code");
