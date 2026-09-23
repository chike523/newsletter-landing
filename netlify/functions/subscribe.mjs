const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  let email = '';
  try {
    const payload = JSON.parse(event.body || '{}');
    email = String(payload.email || '').trim();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body' });
  }

  if (!email || !EMAIL_RE.test(email.toLowerCase())) {
    return json(400, { ok: false, error: 'Valid email is required' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return json(500, { ok: false, error: 'Server is not configured' });
  }

  const text = `New newsletter signup: ${email}`;

  try {
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    const tgData = await tgResponse.json();

    if (!tgResponse.ok || !tgData.ok) {
      console.error('Telegram API error:', tgData);
      return json(502, { ok: false, error: 'Failed to send notification' });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return json(500, { ok: false, error: 'Unexpected server error' });
  }
}
