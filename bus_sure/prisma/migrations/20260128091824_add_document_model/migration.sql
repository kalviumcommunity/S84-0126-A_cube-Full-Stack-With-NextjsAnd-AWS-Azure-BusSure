-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedBy" INTEGER NOT NULL,
    "claimId" INTEGER,
    "policyId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "documents_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "documents_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
