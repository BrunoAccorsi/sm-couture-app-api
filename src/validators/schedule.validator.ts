import { z } from 'zod';
import { ValidationError } from '@/errors/api-error';

export const getScheduleRequestSchema = z.object({
  email: z.string().email(),
});

export type GetScheduleRequest = z.infer<typeof getScheduleRequestSchema>;

export function validateGetScheduleRequest(
  email: string | null
): GetScheduleRequest {
  try {
    return getScheduleRequestSchema.parse({ email });
  } catch {
    throw new ValidationError('Invalid email parameter');
  }
}
