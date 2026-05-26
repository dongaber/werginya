/*
  Warnings:

  - You are about to drop the column `description` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Request` table. All the data in the column will be lost.
  - Added the required column `paymentType` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('RENTAL', 'TRANSPORTATION', 'DELIVERY');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'NON_CASH');

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "paymentType" "PaymentType" NOT NULL,
ADD COLUMN     "type" "RequestType" NOT NULL;
