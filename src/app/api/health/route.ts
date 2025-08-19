import { NextResponse } from 'next/server';

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Thee Cigar Maestro API',
    version: '2.0.0',
    checks: {
      server: 'operational',
      database: 'not_configured', // Will be updated when DB is configured
      cache: 'operational',
      assets: 'operational',
    },
  };

  return NextResponse.json(healthStatus, { status: 200 });
}
