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
    // Fetch JSON from Supabase
    const response = await fetch('https://ariwiqxopyeoukwqvsex.supabase.co/storage/v1/object/sign/cigardata/cigarmaestro.json?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZGIzZmNhYS0wMmJjLTRhNGItOTFmYS1iYWIxOTIyYmU5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjaWdhcmRhdGEvY2lnYXJtYWVzdHJvLmpzb24iLCJpYXQiOjE3NTIyNzg2NzMsImV4cCI6NDkwNTg3ODY3M30.AYy5nuzYEKZTdpfDTkAN80mMUBJSsYAkrqTrywvlfno');
    
    if (!response.ok) {
      throw new Error('Failed to load cigar data');
    }

    const cigars = await response.json();

    // Match prompt to cigar name
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

    return res.status(404).json({ error: 'Cigar not found in verified database.' });
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return res.status(500).json({ error: 'Failed to fetch or parse cigar specs.' });
  }
}
