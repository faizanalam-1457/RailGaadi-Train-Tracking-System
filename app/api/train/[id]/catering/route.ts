import { NextRequest, NextResponse } from 'next/server';
import { GET as handler } from '@/app/api/trains/[trainNumber]/catering/route';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return handler(request, { params: { trainNumber: params.id } });
}
