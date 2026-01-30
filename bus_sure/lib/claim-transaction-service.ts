import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ClaimProcessingData {
  claimId: number;
  approvedAmount: number;
  paymentMethod: 'BANK_TRANSFER' | 'CHECK' | 'DIGITAL_WALLET';
  transactionId?: string;
  processedBy: number;
}

export interface ClaimCreationData {
  userId: number;
  policyId: number;
  incidentDate: Date;
  description: string;
  amount: number;
  claimNumber: string;
}

/**
 * Transaction Workflow: Claim Processing
 * This workflow demonstrates ACID transactions for multi-step operations:
 * 1. Update claim status to APPROVED
 * 2. Create payment record
 * 3. Log audit trail
 * 4. Update policy status if needed
 * 
 * All operations must succeed or fail together to maintain data integrity.
 */
export class ClaimTransactionService {
  
  /**
   * Process a claim approval with payment creation in a single transaction
   * This ensures data consistency across multiple related operations
   */
  async processClaimApproval(data: ClaimProcessingData): Promise<{
    claim: any;
    payment: any;
    auditLog: any;
  }> {
    const startTime = Date.now();
    console.log(`🔄 Starting claim approval transaction for claim ${data.claimId}`);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Step 1: Update claim status to APPROVED
        const updatedClaim = await tx.claim.update({
          where: { id: data.claimId },
          data: {
            status: 'APPROVED',
            amount: data.approvedAmount,
            updatedAt: new Date(),
          },
          include: {
            user: { select: { id: true, name: true, email: true } },
            policy: { select: { id: true, policyNumber: true, status: true } }
          }
        });

        // Step 2: Create payment record
        const payment = await tx.payment.create({
          data: {
            claimId: data.claimId,
            amount: data.approvedAmount,
            method: data.paymentMethod,
            status: 'PENDING',
            transactionId: data.transactionId,
            createdAt: new Date(),
          }
        });

        // Step 3: Create audit log entry
        const auditLog = await tx.auditLog.create({
          data: {
            action: 'CLAIM_APPROVED',
            entityType: 'CLAIM',
            entityId: data.claimId,
            userId: data.processedBy,
            details: JSON.stringify({
              approvedAmount: data.approvedAmount,
              paymentMethod: data.paymentMethod,
              transactionId: data.transactionId,
              originalAmount: updatedClaim.amount,
            }),
            createdAt: new Date(),
          }
        });

        // Step 4: Update policy if this is a large claim (>50% of coverage)
        if (updatedClaim.policy && data.approvedAmount > (updatedClaim.policy as any).coverage * 0.5) {
          await tx.policy.update({
            where: { id: updatedClaim.policyId },
            data: {
              status: 'UNDER_REVIEW',
              updatedAt: new Date(),
            }
          });

          // Log policy status change
          await tx.auditLog.create({
            data: {
              action: 'POLICY_STATUS_CHANGED',
              entityType: 'POLICY',
              entityId: updatedClaim.policyId,
              userId: data.processedBy,
              details: JSON.stringify({
                newStatus: 'UNDER_REVIEW',
                reason: 'Large claim approved',
                claimId: data.claimId,
              }),
              createdAt: new Date(),
            }
          });
        }

        return { claim: updatedClaim, payment, auditLog };
      });

      const endTime = Date.now();
      console.log(`✅ Claim approval transaction completed in ${endTime - startTime}ms`);
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      console.error(`❌ Claim approval transaction failed in ${endTime - startTime}ms:`, error);
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new claim with initial audit log in a transaction
   */
  async createClaimWithAudit(data: ClaimCreationData): Promise<{
    claim: any;
    auditLog: any;
  }> {
    const startTime = Date.now();
    console.log(`🔄 Starting claim creation transaction`);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Step 1: Create the claim
        const claim = await tx.claim.create({
          data: {
            claimNumber: data.claimNumber,
            userId: data.userId,
            policyId: data.policyId,
            incidentDate: data.incidentDate,
            description: data.description,
            amount: data.amount,
            status: 'PENDING',
            createdAt: new Date(),
          },
          include: {
            user: { select: { id: true, name: true, email: true } },
            policy: { select: { id: true, policyNumber: true } }
          }
        });

        // Step 2: Create audit log entry
        const auditLog = await tx.auditLog.create({
          data: {
            action: 'CLAIM_CREATED',
            entityType: 'CLAIM',
            entityId: claim.id,
            userId: data.userId,
            details: JSON.stringify({
              claimNumber: data.claimNumber,
              amount: data.amount,
              incidentDate: data.incidentDate.toISOString(),
            }),
            createdAt: new Date(),
          }
        });

        return { claim, auditLog };
      });

      const endTime = Date.now();
      console.log(`✅ Claim creation transaction completed in ${endTime - startTime}ms`);
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      console.error(`❌ Claim creation transaction failed in ${endTime - startTime}ms:`, error);
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Simulate a transaction failure to test rollback behavior
   * This intentionally fails after some operations to verify rollback works
   */
  async simulateTransactionFailure(claimId: number, userId: number): Promise<void> {
    console.log(`🧪 Testing transaction rollback for claim ${claimId}`);
    
    try {
      await prisma.$transaction(async (tx) => {
        // Step 1: Update claim (this should succeed)
        await tx.claim.update({
          where: { id: claimId },
          data: { status: 'PROCESSING' }
        });

        // Step 2: Create audit log (this should succeed)
        await tx.auditLog.create({
          data: {
            action: 'CLAIM_PROCESSING_STARTED',
            entityType: 'CLAIM',
            entityId: claimId,
            userId: userId,
            details: JSON.stringify({ test: 'rollback simulation' }),
          }
        });

        // Step 3: Intentionally throw an error to trigger rollback
        throw new Error('Simulated transaction failure - testing rollback');
      });
    } catch (error) {
      console.log(`✅ Transaction correctly rolled back: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Verify rollback worked by checking claim status
      const claim = await prisma.claim.findUnique({
        where: { id: claimId },
        select: { status: true }
      });
      
      console.log(`📊 Claim status after rollback: ${claim?.status} (should not be 'PROCESSING')`);
      throw error; // Re-throw to indicate the transaction failed as expected
    }
  }
}

export default ClaimTransactionService;