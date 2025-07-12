// api/gpt.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // 1. Fetch JSON from Supabase Storage (signed URL)
    const response = await fetch('https://ariwiqxopyeoukwqvsex.supabase.co/storage/v1/object/sign/cigardata/cigarmaestro.json?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZGIzZmNhYS0wMmJjLTRhNGItOTFmYS1iYWIxOTIyYmU5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjaWdhcmRhdGEvY2lnYXJtYWVzdHJvLmpzb24iLCJpYXQiOjE3NTIyNzg2NzMsImV4cCI6NDkwNTg3ODY3M30.AYy5nuzYEKZTdpfDTkAN80mMUBJSsYAkrqTrywvlfno');

    if (!response.ok) throw new Error('Failed to fetch cigar data');
    const cigars = await response.json();

    // 2. Match query to known cigar names
    const query = prompt.toLowerCase();
    const matchedKey = Object.keys(cigars).find(name => query.includes(name.toLowerCase()));

    if (matchedKey) {
      const cigar = cigars[matchedKey];
      const result = `
Cigar Name: ${matchedKey}
Length: ${cigar.length}”
Ring Gauge: ${cigar.ringGauge}
Shape: ${cigar.shape}
Color: ${cigar.color}
Strength: ${cigar.strength}
Body: ${cigar.body}
Country: ${cigar.country}
Wrapper: ${cigar.wrapper}
Binder: ${cigar.binder}
Filler: ${cigar.filler}
Tasting Notes: ${cigar.tastingNotes}
      `.trim();

      return res.status(200).json({ result });
    }

    // 3. Fallback to GPT if not found
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a cigar specification assistant. Only give verified specs and clearly say if the cigar is not officially documented.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await openaiResponse.json();
    const answer = data.choices?.[0]?.message?.content || 'No response received.';
    return res.status(200).json({ result: answer });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
