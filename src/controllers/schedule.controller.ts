import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/services/schedule.service';
import { validateGetScheduleRequest } from '@/validators/schedule.validator';
import { ApiError } from '@/errors/api-error';

export class ScheduleController {
  async getSchedules(req: NextRequest): Promise<NextResponse> {
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get('email');

      // Validate the email parameter
      const { email: validatedEmail } = validateGetScheduleRequest(email);

      // Get schedules from the service
      const schedules = await scheduleService.getUpcomingSchedulesByEmail(
        validatedEmail
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
