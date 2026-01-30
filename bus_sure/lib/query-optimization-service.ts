import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Query Optimization Service
 * Demonstrates optimized query patterns using Prisma ORM:
 * - Selective field fetching with select
 * - Pagination with skip/take
 * - Bulk operations with createMany/updateMany
 * - Efficient filtering with indexed fields
 * - Avoiding N+1 queries with include
 */
export class QueryOptimizationService {

  /**
   * OPTIMIZED: Get paginated claims with selective fields
   * Uses indexes on status and createdAt for fast filtering and sorting
   */
  async getOptimizedClaimsList(
    page: number = 1,
    limit: number = 20,
    status?: string,
    userId?: number
  ) {
    const startTime = Date.now();
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (userId) whereClause.userId = userId;

    const [claims, totalCount] = await Promise.all([
      prisma.claim.findMany({
        where: whereClause,
        select: {
          id: true,
          claimNumber: true,
          amount: true,
          status: true,
          incidentDate: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          policy: {
            select: {
              id: true,
              policyNumber: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.claim.count({ where: whereClause })
    ]);

    const endTime = Date.now();
    console.log(`⚡ Optimized claims query completed in ${endTime - startTime}ms`);
    
    return {
      claims,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
      queryTime: endTime - startTime,
    };
  }

  /**
   * UNOPTIMIZED: Example of what NOT to do (for comparison)
   * Fetches all fields and doesn't use pagination
   */
  async getUnoptimizedClaimsList(status?: string) {
    const startTime = Date.now();
    
    const claims = await prisma.claim.findMany({
      where: status ? { status } : {},
      include: {
        user: true,
        policy: {
          include: {
            bus: true,
          }
        },
        documents: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const endTime = Date.now();
    console.log(`🐌 Unoptimized claims query completed in ${endTime - startTime}ms`);
    
    return {
      claims,
      queryTime: endTime - startTime,
    };
  }

  /**
   * OPTIMIZED: Bulk create multiple audit logs efficiently
   */
  async createBulkAuditLogs(logs: Array<{
    action: string;
    entityType: string;
    entityId: number;
    userId: number;
    details?: string;
  }>) {
    const startTime = Date.now();
    
    // Create logs individually since SQLite doesn't support skipDuplicates in createMany
    let count = 0;
    for (const log of logs) {
      try {
        await prisma.auditLog.create({
          data: {
            ...log,
            createdAt: new Date(),
          }
        });
        count++;
      } catch (error) {
        // Skip duplicates
      }
    }

    const endTime = Date.now();
    console.log(`⚡ Bulk audit logs created in ${endTime - startTime}ms`);
    
    return {
      count,
      queryTime: endTime - startTime,
    };
  }

  /**
   * OPTIMIZED: Get user dashboard data with efficient queries
   * Uses selective fields and proper indexing
   */
  async getUserDashboard(userId: number) {
    const startTime = Date.now();

    const [user, activePolicies, recentClaims, pendingPayments] = await Promise.all([
      // User basic info
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      }),

      // Active policies count and list
      prisma.policy.findMany({
        where: {
          userId,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          policyNumber: true,
          premium: true,
          coverage: true,
          endDate: true,
          bus: {
            select: {
              registrationNumber: true,
              make: true,
              model: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent claims
      prisma.claim.findMany({
        where: { userId },
        select: {
          id: true,
          claimNumber: true,
          amount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Pending payments
      prisma.payment.findMany({
        where: {
          status: 'PENDING',
          claim: {
            userId,
          }
        },
        select: {
          id: true,
          amount: true,
          method: true,
          createdAt: true,
          claim: {
            select: {
              claimNumber: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const endTime = Date.now();
    console.log(`⚡ User dashboard query completed in ${endTime - startTime}ms`);

    return {
      user,
      activePolicies,
      recentClaims,
      pendingPayments,
      queryTime: endTime - startTime,
    };
  }

  /**
   * OPTIMIZED: Search claims with full-text search simulation
   * Uses indexed fields for efficient filtering
   */
  async searchClaims(searchTerm: string, limit: number = 10) {
    const startTime = Date.now();

    const claims = await prisma.claim.findMany({
      where: {
        OR: [
          { claimNumber: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { user: { name: { contains: searchTerm } } },
          { user: { email: { contains: searchTerm } } },
        ]
      },
      select: {
        id: true,
        claimNumber: true,
        description: true,
        amount: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const endTime = Date.now();
    console.log(`🔍 Search query completed in ${endTime - startTime}ms`);

    return {
      claims,
      searchTerm,
      resultCount: claims.length,
      queryTime: endTime - startTime,
    };
  }

  /**
   * OPTIMIZED: Get claims analytics with aggregation
   * Uses indexed fields for efficient grouping and counting
   */
  async getClaimsAnalytics(startDate?: Date, endDate?: Date) {
    const startTime = Date.now();

    const whereClause: any = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const [
      totalClaims,
      claimsByStatus,
      avgClaimAmount,
      totalClaimAmount,
    ] = await Promise.all([
      // Total claims count
      prisma.claim.count({ where: whereClause }),

      // Claims grouped by status
      prisma.claim.groupBy({
        by: ['status'],
        where: whereClause,
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
      }),

      // Average claim amount
      prisma.claim.aggregate({
        where: whereClause,
        _avg: {
          amount: true,
        },
      }),

      // Total claim amount
      prisma.claim.aggregate({
        where: whereClause,
        _sum: {
          amount: true,
        },
      }),
    ]);

    const endTime = Date.now();
    console.log(`📊 Analytics query completed in ${endTime - startTime}ms`);

    return {
      totalClaims,
      claimsByStatus,
      avgClaimAmount: avgClaimAmount._avg.amount || 0,
      totalClaimAmount: totalClaimAmount._sum.amount || 0,
      queryTime: endTime - startTime,
    };
  }

  /**
   * OPTIMIZED: Update multiple claims status efficiently
   */
  async bulkUpdateClaimStatus(claimIds: number[], newStatus: string, updatedBy: number) {
    const startTime = Date.now();

    const [updateResult, auditResult] = await Promise.all([
      // Bulk update claims
      prisma.claim.updateMany({
        where: {
          id: { in: claimIds },
        },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      }),

      // Create audit logs for all updates
      prisma.auditLog.createMany({
        data: claimIds.map(claimId => ({
          action: 'CLAIM_STATUS_UPDATED',
          entityType: 'CLAIM',
          entityId: claimId,
          userId: updatedBy,
          details: JSON.stringify({ newStatus }),
          createdAt: new Date(),
        })),
      }),
    ]);

    const endTime = Date.now();
    console.log(`⚡ Bulk update completed in ${endTime - startTime}ms`);

    return {
      updatedCount: updateResult.count,
      auditLogsCreated: auditResult.count,
      queryTime: endTime - startTime,
    };
  }
}

export default QueryOptimizationService;