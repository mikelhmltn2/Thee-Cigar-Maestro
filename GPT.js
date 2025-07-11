// api/gpt.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Load local JSON data
  const filePath = path.join(process.cwd(), 'data', 'cigarmaestro.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cigars = JSON.parse(fileContents);

  // Try to match prompt with a cigar name
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

  // Fallback to GPT if no match found
  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a cigar specification assistant. Only give verified specs." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await openaiResponse.json();
    const answer = data.choices?.[0]?.message?.content || 'No response received.';
    return res.status(200).json({ result: answer });

  } catch (error) {
    console.error('GPT API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
