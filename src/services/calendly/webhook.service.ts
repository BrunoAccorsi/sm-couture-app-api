import { calendlyWebhookSchema } from '@/schemas/calendly';

import { ZodError } from 'zod';
import { handleInviteeCreated } from './event-handlers/invitee-created.handler';
import { handleInviteeCanceled } from './event-handlers/invitee-canceled.handler';

export type EventHandlerResult = {
  message?: string;
  error?: string;
  status: number;
};

export class CalendlyWebhookService {
  async processWebhook(body: unknown): Promise<EventHandlerResult> {
    try {
      const parsedResult = calendlyWebhookSchema.safeParse(body);

      if (!parsedResult.success) {
        console.error('Validation error:', parsedResult.error);
        return {
          error: 'Invalid webhook payload format',
          status: 400,
        };
      }

      const webhook = parsedResult.data;
      const eventType = webhook.event;

      // Use switch statement instead of record lookup
      switch (eventType) {
        case 'invitee.created':
          return await handleInviteeCreated(webhook);
        case 'invitee.canceled':
          return await handleInviteeCanceled(webhook);
        default:
          return {
            message: 'Webhook received but no action taken',
            status: 200,
          };
      }
    } catch (error) {
      console.error('Error processing webhook:', error);

      if (error instanceof ZodError) {
        console.error('Validation error details:', error.errors);
        return {
          error: 'Invalid webhook payload format',
          message: JSON.stringify(error.errors),
          status: 400,
        };
      }

      return {
        error: 'Failed to process webhook',
        status: 500,
      };
    }
  }
}

export const webhookService = new CalendlyWebhookService();
