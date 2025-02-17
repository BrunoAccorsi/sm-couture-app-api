import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const getScheduleRequestSchema = z.object({
  email: z.string().email(),
});

export const GET = async (req: NextRequest) => {
  console.log('GET /api/schedules');
  console.log(req);
  try {
    const { userId } = await auth();
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const { email: validatedEmail } = getScheduleRequestSchema.parse({ email });

    const schedules = await db
      .select()
      .from(userSchedule)
      .where(eq(userSchedule.email, validatedEmail));
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 400 }
    );
  }
};
