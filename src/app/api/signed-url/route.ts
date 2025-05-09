import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

// Helper to safely parse JSON
const parseServiceAccount = (key: string) => {
  try {
    // Handle case where key might be double-quoted
    const parsed = JSON.parse(key.startsWith('"') ? JSON.parse(key) : key);
    return parsed;
  } catch {
    console.error('Failed to parse GCP key:', key);
    throw new Error('Invalid GCP_SERVICE_ACCOUNT_KEY format');
  }
};

export async function GET(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.GCP_SERVICE_ACCOUNT_KEY || !process.env.GCP_BUCKET_NAME) {
      throw new Error('Missing GCP configuration');
    }

    const credentials = parseServiceAccount(process.env.GCP_SERVICE_ACCOUNT_KEY);
    const storage = new Storage({ credentials });

    const { searchParams } = new URL(request.url);
    const videoName = searchParams.get('video');

    if (!videoName) {
      return NextResponse.json(
        { error: 'Missing video parameter' },
        { status: 400 }
      );
    }

    const [url] = await storage
      .bucket(process.env.GCP_BUCKET_NAME)
      .file(videoName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000,
      });

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error:', message);
    return NextResponse.json(
      {
        error: 'Failed to generate URL',
        details: message,
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    );
  }
}