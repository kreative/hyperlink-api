-- AlterTable
ALTER TABLE "Click" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "browserVersion" TEXT,
ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "deviceVendor" TEXT,
ADD COLUMN     "isBot" BOOLEAN,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "platform" TEXT,
ADD COLUMN     "referralUrl" TEXT,
ADD COLUMN     "source" TEXT;
