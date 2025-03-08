import z from 'zod';

export const scheduledEventSchema = z.object({
  uri: z.string(),
  name: z.string(),
  start_time: z.string(),
  status: z.string(),
});

export const calendlyWebhookPayloadSchema = z.object({
  cancel_url: z.string(),
  created_at: z.string(),
  email: z.string(),
  reschedule_url: z.string(),
  scheduled_event: scheduledEventSchema,
});

export const calendlyWebhookSchema = z.object({
  event: z.string(),
  payload: calendlyWebhookPayloadSchema,
});

export type CalendlyWebhook = z.infer<typeof calendlyWebhookSchema>;
export type CalendlyWebhookPayload = z.infer<
  typeof calendlyWebhookPayloadSchema
>;
