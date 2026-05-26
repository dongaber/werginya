-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "cargo" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "toLat" DECIMAL(10,7),
    "toLng" DECIMAL(10,7),
    "startsAt" TIMESTAMP(3) NOT NULL,
    "volume" TEXT NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_requestId_key" ON "Delivery"("requestId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
