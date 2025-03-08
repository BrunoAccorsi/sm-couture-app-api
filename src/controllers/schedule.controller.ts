import { ApiError } from '@/errors/api-error';
import { scheduleService } from '@/services/schedule.service';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export class ScheduleController {
  async getSchedules(): Promise<NextResponse> {
    try {
      const { userId } = await auth();
      if (!userId) {
        throw new ApiError('Unauthorized', 401);
      }
      // Get schedules from the service
      const schedules = await scheduleService.getUpcomingSchedulesByUserId(
        userId
      );

      return NextResponse.json(schedules);
    } catch (error) {
      console.error('Controller error:', error);

      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}

export const scheduleController = new ScheduleController();
