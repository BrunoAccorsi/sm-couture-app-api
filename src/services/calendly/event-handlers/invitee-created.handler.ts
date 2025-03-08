import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { CalendlyWebhook } from '@/schemas/calendly';
import { extractEventId } from '@/utils/calendly';

export async function handleInviteeCreated(webhook: CalendlyWebhook) {
  const { payload } = webhook;
  const event_id = extractEventId(payload.scheduled_event.uri);

  await db.insert(userSchedule).values({
    userId: payload.tracking.salesforce_uuid,
    event_id,
    event: payload.scheduled_event.name,
    createdAt: new Date(payload.created_at),
    cancel_url: payload.cancel_url,
    reschedule_url: payload.reschedule_url,
    start_time: new Date(payload.scheduled_event.start_time),
    status: payload.scheduled_event.status,
  });

  return {
    message: 'Webhook invitee created successfully',
    status: 200,
  };
}
