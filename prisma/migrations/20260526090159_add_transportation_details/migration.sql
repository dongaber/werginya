-- CreateTable
CREATE TABLE "Transportation" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "equipmentTypeId" INTEGER NOT NULL,
    "cargo" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "fromLat" DECIMAL(10,7),
    "fromLng" DECIMAL(10,7),
    "toAddress" TEXT NOT NULL,
    "toLat" DECIMAL(10,7),
    "toLng" DECIMAL(10,7),
    "startsAt" TIMESTAMP(3) NOT NULL,
    "ratePerHour" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Transportation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transportation_requestId_key" ON "Transportation"("requestId");

-- AddForeignKey
ALTER TABLE "Transportation" ADD CONSTRAINT "Transportation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transportation" ADD CONSTRAINT "Transportation_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "EquipmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
