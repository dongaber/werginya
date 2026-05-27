-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'PUBLISHED';

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "contactTelegram" TEXT,
ADD COLUMN     "contactWhatsapp" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "filterEquipIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "filterGeoCity" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "HelpFaq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HelpFaq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpContact" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HelpContact_pkey" PRIMARY KEY ("id")
);
