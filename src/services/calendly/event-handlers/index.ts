import { CalendlyWebhook } from '@/schemas/calendly';
import { handleInviteeCreated } from './invitee-created.handler';
import { handleInviteeCanceled } from './invitee-canceled.handler';

export type EventHandlerResult = {
  message?: string;
  error?: string;
  status: number;
};

export const eventHandlers: Record<
  string,
  (webhook: CalendlyWebhook) => Promise<EventHandlerResult>
> = {
  'invitee.created': handleInviteeCreated,
  'invitee.canceled': handleInviteeCanceled,
};
