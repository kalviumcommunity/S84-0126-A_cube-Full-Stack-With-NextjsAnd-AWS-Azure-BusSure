import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET_NAME;
const maxSize = Number(process.env.MAX_UPLOAD_SIZE_BYTES ?? 5 * 1024 * 1024);

const s3 = new S3Client({ region });

export async function POST(req: NextRequest) {
  try {
    if (!region || !bucket) {
      return NextResponse.json(
        { success: false, message: 'Storage is not configured on the server.' },
        { status: 500 }
      );
    }

    const { filename, fileType, fileSize } = await req.json();

    if (!filename || !fileType) {
      return NextResponse.json(
        { success: false, message: 'filename and fileType are required' },
        { status: 400 }
      );
    }

    if (!fileType.startsWith('image/') && !fileType.startsWith('application/pdf')) {
      return NextResponse.json(
        { success: false, message: 'Unsupported file type' },
        { status: 400 }
      );
    }

    if (typeof fileSize === 'number' && fileSize > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File is too large' },
        { status: 400 }
      );
    }

    const key = `uploads/${Date.now()}-${randomUUID()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

    const fileURL = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      uploadURL,
      fileKey: key,
      fileURL,
      originalName: filename,
      expiresIn: 60,
      maxSize,
    });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate pre-signed URL' },
      { status: 500 }
    );
  }
}
