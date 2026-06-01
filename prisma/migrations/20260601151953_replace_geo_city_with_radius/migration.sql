/*
  Warnings:

  - You are about to drop the column `filterGeoCity` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "filterGeoCity",
ADD COLUMN     "filterGeoLat" DECIMAL(10,7),
ADD COLUMN     "filterGeoLng" DECIMAL(10,7),
ADD COLUMN     "filterGeoRadiusKm" INTEGER;
