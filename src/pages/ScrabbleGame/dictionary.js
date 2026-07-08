const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export async function validateWord(word) {
  try {
    const res = await fetch(`${API_BASE}${encodeURIComponent(word.toLowerCase())}`);
    if (res.status === 200) return { word, valid: true, error: null };
    if (res.status === 404) return { word, valid: false, error: 'not-found' };
    return { word, valid: false, error: 'network' };
  } catch (e) {
    return { word, valid: false, error: 'network' };
  }
}

export function validateWords(words) {
  return Promise.all(words.map(validateWord));
}
