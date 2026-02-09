import { NextRequest, NextResponse } from 'next/server';
import QueryOptimizationService from '../../../../lib/query-optimization-service';
import { getCachedJson, setCachedJson, deleteKeysByPattern } from '../../../../lib/redis';

const queryService = new QueryOptimizationService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;

    const cacheKey = `claims:optimized:page=${page}:limit=${limit}:status=${status ?? 'any'}:userId=${userId ?? 'any'}`;
    const ttl = Number(process.env.REDIS_TTL_SECONDS ?? 300);

    const cached = await getCachedJson<unknown>(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const result = await queryService.getOptimizedClaimsList(page, limit, status, userId);

    await setCachedJson(cacheKey, result, ttl);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Optimized claims query error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch claims',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case 'search':
        result = await queryService.searchClaims(data.searchTerm, data.limit);
        break;
      
      case 'analytics':
        result = await queryService.getClaimsAnalytics(
          data.startDate ? new Date(data.startDate) : undefined,
          data.endDate ? new Date(data.endDate) : undefined
        );
        break;
      
      case 'dashboard':
        result = await queryService.getUserDashboard(data.userId);
        break;
      
      case 'bulkUpdate':
        result = await queryService.bulkUpdateClaimStatus(
          data.claimIds,
          data.newStatus,
          data.updatedBy
        );
        // Invalidate any cached optimized claims when bulk status changes
        await deleteKeysByPattern('claims:optimized:*');
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Optimized claims operation error:', error);
    return NextResponse.json(
      { 
        error: 'Operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}