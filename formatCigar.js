// lib/formatCigar.js
export function formatCigarInfo(name, cigar) {
  return `Cigar Name: ${name}
Length: ${cigar.length || 'N/A'}"
Ring Gauge: ${cigar.ringGauge || 'N/A'}
Shape: ${cigar.shape || 'N/A'}
Color: ${cigar.color || 'N/A'}
Strength: ${cigar.strength || 'N/A'}
Body: ${cigar.body || 'N/A'}
Country: ${cigar.country || 'N/A'}
Wrapper: ${cigar.wrapper || 'N/A'}
Binder: ${cigar.binder || 'N/A'}
Filler: ${cigar.filler || 'N/A'}
Tasting Notes: ${cigar.tastingNotes || 'N/A'}
Source: CigarMaestro Database`.trim();
}
