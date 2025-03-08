import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { scheduleController } from '@/controllers/schedule.controller';
import { UnauthorizedError, ApiError } from '@/errors/api-error';

export const GET = async (): Promise<NextResponse> => {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthorizedError();
    }

    // Delegate to controller
    return await scheduleController.getSchedules();
  } catch (error) {
    console.error('Route error:', error);

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
};
