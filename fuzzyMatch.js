// lib/fuzzyMatch.js
export function fuzzyMatch(query, targets) {
  const normalizedQuery = query.toLowerCase().trim();

  // 1. Exact match
  for (const target of targets) {
    if (target.toLowerCase() === normalizedQuery) return target;
  }

  // 2. Substring match
  for (const target of targets) {
    if (target.toLowerCase().includes(normalizedQuery)) return target;
  }

  // 3. Word-based partial match
  const queryWords = normalizedQuery.split(/\s+/);
  for (const target of targets) {
    const targetLower = target.toLowerCase();
    const matchCount = queryWords.filter(word =>
      targetLower.includes(word) && word.length > 2
    ).length;

    if (matchCount >= Math.min(queryWords.length, 2)) {
      return target;
    }
  }

  return null;
}
