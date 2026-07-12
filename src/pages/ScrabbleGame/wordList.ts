import { buildTrie, reverseWord } from './trie';
import { Tries } from './types';

// word list is sourced from sindresorhus/word-list (MIT), itself derived from
// the SCOWL project. It's the single source of truth for word legality: the
// same trie drives the board's green/red word-validity borders, hint
// generation, no-legal-moves checks, and the actual submit() grading, so a
// word can never look valid and then be rejected (or vice versa).
//
// The file is shipped gzipped (~700KB vs ~2.7MB raw) and decompressed here in
// the browser, since the static host doesn't transparently serve/decode a
// pre-compressed .gz asset the way it would a normal gzip Content-Encoding.
const DICTIONARY_URL = `${process.env.PUBLIC_URL}/dictionaries/scrabble-words.txt.gz`;

let dictionaryPromise: Promise<Tries> | null = null;

// returns { forward, reverse } trie roots, fetching and building them once
// and caching the result for the lifetime of the page
export function loadDictionary(): Promise<Tries> {
  if (!dictionaryPromise) {
    dictionaryPromise = fetch(DICTIONARY_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load word list');
        if (typeof window.DecompressionStream === 'undefined') {
          throw new Error("This browser can't decompress the word list.");
        }
        if (!res.body) throw new Error('Failed to load word list');
        const stream = res.body.pipeThrough(new window.DecompressionStream('gzip'));
        return new Response(stream).text();
      })
      .then((text) => {
        const words = text
          .split('\n')
          .map((w) => w.trim())
          .filter((w) => w.length >= 2 && w.length <= 15);
        return {
          forward: buildTrie(words),
          reverse: buildTrie(words.map(reverseWord)),
        };
      })
      .catch((err) => {
        dictionaryPromise = null; // allow retry on next call
        throw err;
      });
  }
  return dictionaryPromise;
}
