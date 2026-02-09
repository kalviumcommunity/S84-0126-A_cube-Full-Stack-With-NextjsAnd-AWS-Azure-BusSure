import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fileKey,
      originalName,
      fileURL,
      mimeType,
      size,
      uploadedBy,
      claimId,
      policyId,
    } = body;

    if (!fileKey || !originalName || !fileURL || !mimeType || !size || !uploadedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const record = await prisma.document.create({
      data: {
        filename: fileKey,
        originalName,
        mimeType,
        size,
        url: fileURL,
        uploadedBy,
        claimId: claimId ?? null,
        policyId: policyId ?? null,
      },
    });

    return NextResponse.json({ success: true, file: record });
  } catch (error) {
    console.error('Error saving file metadata:', error);
    return NextResponse.json(
      { success: false, message: 'DB insertion failed' },
      { status: 500 }
    );
  }
}
