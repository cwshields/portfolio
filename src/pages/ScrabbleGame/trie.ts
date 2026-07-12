import { TrieNode } from './types';

// minimal trie: children is a plain object keyed by letter, isWord marks a
// node that terminates a real word (as opposed to just being a prefix of one)
function makeNode(): TrieNode {
  return { children: {}, isWord: false };
}

export function buildTrie(words: string[]): TrieNode {
  const root = makeNode();
  for (const word of words) {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      let next = node.children[letter];
      if (!next) {
        next = makeNode();
        node.children[letter] = next;
      }
      node = next;
    }
    node.isWord = true;
  }
  return root;
}

export function step(node: TrieNode | null, letter: string): TrieNode | null {
  return (node && node.children[letter]) || null;
}

export function isWord(root: TrieNode, word: string): boolean {
  let node: TrieNode | null = root;
  for (let i = 0; i < word.length; i++) {
    node = step(node, word[i]);
    if (!node) return false;
  }
  return node.isWord;
}

export function reverseWord(word: string): string {
  return word.split('').reverse().join('');
}
