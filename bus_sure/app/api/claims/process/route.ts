import { NextRequest, NextResponse } from 'next/server';
import ClaimTransactionService from '../../../../lib/claim-transaction-service';

const transactionService = new ClaimTransactionService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, approvedAmount, paymentMethod, transactionId, processedBy } = body;

    // Validate required fields
    if (!claimId || !approvedAmount || !paymentMethod || !processedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process claim approval with transaction
    const result = await transactionService.processClaimApproval({
      claimId: parseInt(claimId),
      approvedAmount: parseFloat(approvedAmount),
      paymentMethod,
      transactionId,
      processedBy: parseInt(processedBy),
    });

    return NextResponse.json({
      success: true,
      message: 'Claim processed successfully',
      data: result,
    });

  } catch (error) {
    console.error('Claim processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process claim',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}