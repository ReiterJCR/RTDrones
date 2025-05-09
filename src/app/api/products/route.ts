import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { Storage } from '@google-cloud/storage';

// Helper to safely parse JSON
const parseServiceAccount = (key: string) => {
  try {
    // Handle case where key might be double-quoted
    const parsed = JSON.parse(key.startsWith('"') ? JSON.parse(key) : key);
    return parsed;
  } catch (err) {
    console.error('Failed to parse GCP key:', key);
    throw new Error('Invalid GCP_SERVICE_ACCOUNT_KEY format');
  }
};
const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

export async function GET() {
  try {
    // Validate environment variables
    if (!process.env.GCP_SERVICE_ACCOUNT_KEY || !process.env.GCP_BUCKET_NAME) {
      throw new Error('Missing GCP configuration');
    }
    if (!process.env.DATABASE_URL) {
      throw new Error('Missing DATABASE_URL');
    }


    const credentials = parseServiceAccount(process.env.GCP_SERVICE_ACCOUNT_KEY);
    const storage = new Storage({ credentials });
    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

    const { rows } = await pool.query('SELECT * FROM products');
    const formattedRows = await Promise.all(
      rows.map(async (row) => {
        let signedUrl = '';
        if (row.imageurl) {
          const [url] = await bucket.file(row.imageurl).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          });
          signedUrl = url;
        }
        return {
          ...row,
          imageUrl: signedUrl,
          availableFor: Array.isArray(row.availablefor)
            ? row.availablefor
            : (row.availablefor || []).map((item: string) => item.trim()),
        };
      })
    );

    return NextResponse.json(formattedRows);
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
}
}