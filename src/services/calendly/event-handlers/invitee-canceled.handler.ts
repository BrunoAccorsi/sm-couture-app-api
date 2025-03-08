import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { CalendlyWebhook } from '@/schemas/calendly';
import { extractEventId } from '@/utils/calendly';
import { eq } from 'drizzle-orm';

export async function handleInviteeCanceled(webhook: CalendlyWebhook) {
  const { payload } = webhook;
  const event_id = extractEventId(payload.scheduled_event.uri);

  console.log('Updating record with event_id:', event_id);
  console.log('New status:', payload.scheduled_event.status);

  // Check if the record exists
  const existingRecord = await db
    .select()
    .from(userSchedule)
    .where(eq(userSchedule.event_id, event_id))
    .limit(1);

  console.log('Existing record:', existingRecord);

  if (existingRecord.length === 0) {
    console.log('No matching record found for event_id:', event_id);
    return {
      error: 'No matching schedule found for this event',
      status: 404,
    };
  }

  const result = await db
    .update(userSchedule)
    .set({
      status: payload.scheduled_event.status,
    })
    .where(eq(userSchedule.event_id, event_id));

  console.log('Update result:', result);

  return {
    message: 'Webhook invitee canceled successfully',
    status: 200,
  };
}
