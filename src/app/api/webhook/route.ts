// /app/api/hello/route.ts
import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const inviteeCreatedSchema = z.object({
  event: z.string(),
  payload: z.object({
    cancel_url: z.string(),
    created_at: z.string(),
    email: z.string(),
    reschedule_url: z.string(),
  }),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsedBody = inviteeCreatedSchema.parse(body);

    await db.insert(userSchedule).values({
      email: parsedBody.payload.email,
      event: parsedBody.event,
      createdAt: new Date(parsedBody.payload.created_at),
      cancel_url: parsedBody.payload.cancel_url,
      reschedule_url: parsedBody.payload.reschedule_url,
    });

    // Return a successful response
    return NextResponse.json(
      { message: 'Webhook received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 400 }
    );
  }
};
