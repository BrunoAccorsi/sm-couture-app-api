import { calendlyWebhookSchema } from '@/schemas/calendly';
import { eventHandlers, EventHandlerResult } from './event-handlers';
import { ZodError } from 'zod';

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

      // Get the appropriate handler for this event type
      const handler = eventHandlers[eventType];

      if (!handler) {
        return {
          message: 'Webhook received but no action taken',
          status: 200,
        };
      }

      // Execute the handler
      return await handler(webhook);
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
