/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `schedules` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "bookings_bookingRef_idx";

-- DropIndex
DROP INDEX "payments_transactionId_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_refund_policies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hoursBeforeDeparture" INTEGER NOT NULL,
    "refundPercentage" REAL NOT NULL,
    "processingFee" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "refund_policies_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "bus_operators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_refund_policies" ("createdAt", "description", "hoursBeforeDeparture", "id", "isActive", "name", "operatorId", "processingFee", "refundPercentage", "updatedAt") SELECT "createdAt", "description", "hoursBeforeDeparture", "id", "isActive", "name", "operatorId", "processingFee", "refundPercentage", "updatedAt" FROM "refund_policies";
DROP TABLE "refund_policies";
ALTER TABLE "new_refund_policies" RENAME TO "refund_policies";
CREATE INDEX "refund_policies_operatorId_idx" ON "refund_policies"("operatorId");
CREATE TABLE "new_refunds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "requestedAmount" REAL NOT NULL,
    "refundAmount" REAL NOT NULL,
    "processingFee" REAL NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "refunds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "refunds_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "refunds_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "refund_policies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_refunds" ("bookingId", "createdAt", "id", "policyId", "processedAt", "processingFee", "reason", "refundAmount", "requestedAmount", "status", "updatedAt", "userId") SELECT "bookingId", "createdAt", "id", "policyId", "processedAt", "processingFee", "reason", "refundAmount", "requestedAmount", "status", "updatedAt", "userId" FROM "refunds";
DROP TABLE "refunds";
ALTER TABLE "new_refunds" RENAME TO "refunds";
CREATE INDEX "refunds_userId_idx" ON "refunds"("userId");
CREATE INDEX "refunds_bookingId_idx" ON "refunds"("bookingId");
CREATE TABLE "new_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "busId" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "basePrice" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "schedules_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "schedules_busId_fkey" FOREIGN KEY ("busId") REFERENCES "buses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_schedules" ("arrivalTime", "basePrice", "busId", "createdAt", "departureTime", "id", "isActive", "routeId", "updatedAt") SELECT "arrivalTime", "basePrice", "busId", "createdAt", "departureTime", "id", "isActive", "routeId", "updatedAt" FROM "schedules";
DROP TABLE "schedules";
ALTER TABLE "new_schedules" RENAME TO "schedules";
CREATE INDEX "schedules_departureTime_idx" ON "schedules"("departureTime");
CREATE INDEX "schedules_routeId_departureTime_idx" ON "schedules"("routeId", "departureTime");
CREATE UNIQUE INDEX "schedules_busId_departureTime_key" ON "schedules"("busId", "departureTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
