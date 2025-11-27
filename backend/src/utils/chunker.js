export default function chunker(text, wordsPerChunk = 300, overlap = 50) {
  const words = (text || '').split(/\s+/).filter(Boolean);
  const chunks = [];
  if (words.length === 0) return chunks;
  for (let i = 0; i < words.length; i += (wordsPerChunk - overlap)) {
    const piece = words.slice(i, Math.min(i + wordsPerChunk, words.length)).join(' ');
    chunks.push(piece);
    if (i + wordsPerChunk >= words.length) break;
  }
  return chunks;
}
