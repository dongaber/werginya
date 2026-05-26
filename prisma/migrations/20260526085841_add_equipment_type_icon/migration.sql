/*
  Warnings:

  - Added the required column `icon` to the `EquipmentType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EquipmentType" ADD COLUMN     "icon" TEXT NOT NULL;
