import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const calendlyWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    cancel_url: z.string(),
    created_at: z.string(),
    email: z.string(),
    reschedule_url: z.string(),
    scheduled_event: z.object({
      uri: z.string(),
      name: z.string(),
      start_time: z.string(),
      status: z.string(),
    }),
  }),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log('Received webhook payload:', body);

    const parsedResult = calendlyWebhookSchema.safeParse(body);
    if (!parsedResult.success) {
      console.error('Validation error:', parsedResult.error);
      return NextResponse.json(
        { error: 'Invalid webhook payload format' },
        { status: 400 }
      );
    }
    const parsedBody = parsedResult.data;

    const event_id = parsedBody.payload.scheduled_event.uri.replace(
      'https://api.calendly.com/scheduled_events/',
      ''
    );

    if (parsedBody.event === 'invitee.created') {
      await db.insert(userSchedule).values({
        email: parsedBody.payload.email,
        event_id,
        event: parsedBody.payload.scheduled_event.name,
        createdAt: new Date(parsedBody.payload.created_at),
        cancel_url: parsedBody.payload.cancel_url,
        reschedule_url: parsedBody.payload.reschedule_url,
        start_time: new Date(parsedBody.payload.scheduled_event.start_time),
        status: parsedBody.payload.scheduled_event.status,
      });

      return NextResponse.json(
        { message: 'Webhook invitee created successfully' },
        { status: 200 }
      );
    }

    if (parsedBody.event === 'invitee.canceled') {
      console.log('Updating record with event_id:', event_id);
      console.log('New status:', parsedBody.payload.scheduled_event.status);

      // First check if the record exists
      const existingRecord = await db
        .select()
        .from(userSchedule)
        .where(eq(userSchedule.event_id, event_id))
        .limit(1);

      console.log('Existing record:', existingRecord);

      if (existingRecord.length === 0) {
        console.log('No matching record found for event_id:', event_id);
        return NextResponse.json(
          { error: 'No matching schedule found for this event' },
          { status: 404 }
        );
      }

      const result = await db
        .update(userSchedule)
        .set({
          status: parsedBody.payload.scheduled_event.status,
        })
        .where(eq(userSchedule.event_id, event_id));

      console.log('Update result:', result);

      return NextResponse.json(
        { message: 'Webhook invitee canceled successfully' },
        { status: 200 }
      );
    }

    // Handle other event types or return a default response
    return NextResponse.json(
      { message: 'Webhook received but no action taken' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.errors);
      return NextResponse.json(
        {
          error: 'Invalid webhook payload format',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
};
