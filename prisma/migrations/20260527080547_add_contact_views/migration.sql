-- CreateTable
CREATE TABLE "ContactView" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactView_userId_requestId_key" ON "ContactView"("userId", "requestId");

-- AddForeignKey
ALTER TABLE "ContactView" ADD CONSTRAINT "ContactView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactView" ADD CONSTRAINT "ContactView_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
