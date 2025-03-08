import { NextRequest, NextResponse } from 'next/server';
import { validateCalendlyWebhookSignature } from '@/utils/calendly';
import { webhookService } from '@/services/calendly/webhook.service';

export const POST = async (req: NextRequest) => {
  try {
    const calendlySignature = req.headers.get('Calendly-Webhook-Signature');

    // Read the request body as text
    const bodyText = await req.text();

    // Validate the Calendly signature
    try {
      validateCalendlyWebhookSignature(calendlySignature, bodyText);
    } catch (error) {
      if (
        (error as Error).message === 'Missing Calendly-Webhook-Signature header'
      ) {
        return NextResponse.json(
          { error: 'Missing Calendly-Webhook-Signature header' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 401 }
      );
    }

    // Parse the body text to JSON after validation
    const body = JSON.parse(bodyText);
    console.log('Received webhook payload:', body);

    // Process webhook with dedicated service
    const result = await webhookService.processWebhook(body);

    return NextResponse.json(
      result.error
        ? { error: result.error }
        : { message: result.message || 'Webhook processed' },
      { status: result.status }
    );
  } catch (error) {
    console.error('Unhandled error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
};
