export const RACK_SIZE = 7;

const LETTER_DISTRIBUTION = [
  { name: 'a', score: 1, count: 9 },
  { name: 'b', score: 3, count: 2 },
  { name: 'c', score: 3, count: 2 },
  { name: 'd', score: 2, count: 4 },
  { name: 'e', score: 1, count: 12 },
  { name: 'f', score: 4, count: 2 },
  { name: 'g', score: 2, count: 3 },
  { name: 'h', score: 4, count: 2 },
  { name: 'i', score: 1, count: 9 },
  { name: 'j', score: 8, count: 1 },
  { name: 'k', score: 5, count: 1 },
  { name: 'l', score: 1, count: 4 },
  { name: 'm', score: 3, count: 2 },
  { name: 'n', score: 1, count: 6 },
  { name: 'o', score: 1, count: 8 },
  { name: 'p', score: 3, count: 2 },
  { name: 'q', score: 10, count: 1 },
  { name: 'r', score: 1, count: 6 },
  { name: 's', score: 1, count: 4 },
  { name: 't', score: 1, count: 6 },
  { name: 'u', score: 1, count: 4 },
  { name: 'v', score: 4, count: 2 },
  { name: 'w', score: 4, count: 2 },
  { name: 'x', score: 8, count: 1 },
  { name: 'y', score: 4, count: 2 },
  { name: 'z', score: 10, count: 1 },
];

export const SCORES = LETTER_DISTRIBUTION.reduce((acc, { name, score }) => {
  acc[name] = score;
  return acc;
}, {});

export function shuffle(arr) {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  return shuffled;
}

export function createBag() {
  const bag = [];
  LETTER_DISTRIBUTION.forEach(({ name, count }) => {
    for (let i = 0; i < count; i++) bag.push(name);
  });
  return shuffle(bag);
}

export function drawTiles(bag, count) {
  return { drawn: bag.slice(0, count), remainingBag: bag.slice(count) };
}
