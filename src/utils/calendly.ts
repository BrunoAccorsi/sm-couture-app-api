import crypto from 'crypto';

export interface SignatureParts {
  t: string;
  signature: string;
}

/**
 * Extracts event ID from Calendly event URI
 */
export function extractEventId(uri: string): string {
  return uri.replace('https://api.calendly.com/scheduled_events/', '');
}

/**
 * Parses the Calendly signature header into its components
 */
export function parseSignatureHeader(signature: string): SignatureParts {
  return signature.split(',').reduce(
    (acc, currentValue) => {
      const [key, value] = currentValue.split('=');

      if (key === 't') {
        // UNIX timestamp
        acc.t = value;
      }

      if (key === 'v1') {
        acc.signature = value;
      }

      return acc;
    },
    { t: '', signature: '' } as SignatureParts
  );
}

/**
 * Validates if a request is genuinely coming from Calendly by checking its signature
 * @param signature The Calendly-Webhook-Signature header value
 * @param bodyText The raw request body as text
 * @returns True if the signature is valid, throws an Error otherwise
 */
export function validateCalendlyWebhookSignature(
  signature: string | null,
  bodyText: string
): boolean {
  const webhookSigningKey = process.env.CALENDLY_WEBHOOK_SECRET;

  if (!signature) {
    throw new Error('Missing Calendly-Webhook-Signature header');
  }

  const { t, signature: sig } = parseSignatureHeader(signature);

  if (!t || !sig) throw new Error('Invalid Signature');

  // Create the signed payload by concatenating the timestamp (t), the character '.' and the request body's JSON payload.
  const data = t + '.' + bodyText;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSigningKey!)
    .update(data, 'utf8')
    .digest('hex');

  // Determine the expected signature by computing an HMAC with the SHA256 hash function.
  if (expectedSignature !== sig) {
    throw new Error('Invalid Signature');
  }

  return true;
}
