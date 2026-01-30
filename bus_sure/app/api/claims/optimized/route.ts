import { NextRequest, NextResponse } from 'next/server';
import QueryOptimizationService from '../../../../lib/query-optimization-service';

const queryService = new QueryOptimizationService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;

    // Get optimized claims list
    const result = await queryService.getOptimizedClaimsList(page, limit, status, userId);

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