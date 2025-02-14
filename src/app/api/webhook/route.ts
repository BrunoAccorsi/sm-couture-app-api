// /app/api/hello/route.ts
import { NextResponse } from 'next/server';

export const GET = async () => {
  return NextResponse.json({ message: 'Hello, API!' });
};
