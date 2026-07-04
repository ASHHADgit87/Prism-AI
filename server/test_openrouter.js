// Simple test script to call OpenRouter chat completions and log the response
// Usage: OPENROUTER_API_KEY=sk-... node server/test_openrouter.js

const fetch = global.fetch || require('node-fetch');

(async () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('No API key found. Set OPENROUTER_API_KEY or AI_API_KEY');
    process.exit(1);
  }

  const payload = {
    model: 'xiaomi/mimo-v2.5',
    messages: [
      { role: 'user', content: "Generate a minimal HTML page with a hero and a footer. Respond with only the HTML." },
    ],
    max_tokens: 2000,
    stream: false,
  };

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response body (truncated 4000 chars):\n', text.slice(0, 4000));
    if (res.status >= 400) process.exit(2);
  } catch (err) {
    console.error('Request failed', err);
    process.exit(3);
  }
})();
