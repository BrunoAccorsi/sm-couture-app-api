import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const getScheduleRequestSchema = z.object({
  email: z.string().email(),
});

export const GET = async (req: NextRequest) => {
  try {
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
