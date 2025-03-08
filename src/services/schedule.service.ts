import { db } from '@/db';
import { userSchedule } from '@/db/schema';
import { SelectUserSChedule } from '@/db/schema';
import { DatabaseError } from '@/errors/api-error';
import { and, eq, gt } from 'drizzle-orm';

export class ScheduleService {
  async getUpcomingSchedulesByEmail(
    email: string
  ): Promise<SelectUserSChedule[]> {
    try {
      return await db
        .select()
        .from(userSchedule)
        .where(
          and(
            eq(userSchedule.email, email),
            gt(userSchedule.start_time, new Date())
          )
        );
    } catch (error) {
      console.error('Database error when fetching schedules:', error);
      throw new DatabaseError('Failed to retrieve schedules');
    }
  }
}

export const scheduleService = new ScheduleService();
