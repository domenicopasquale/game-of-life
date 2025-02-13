export const PATTERNS = {
  // Oscillatori
  blinker: {
    name: 'Blinker',
    category: 'Oscillators',
    pattern: [[true, true, true]]
  },
  toad: {
    name: 'Toad',
    category: 'Oscillators',
    pattern: [
      [false, true, true, true],
      [true, true, true, false]
    ]
  },
  beacon: {
    name: 'Beacon',
    category: 'Oscillators',
    pattern: [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, true, true],
      [false, false, true, true]
    ]
  },

  // Astronavi
  glider: {
    name: 'Glider',
    category: 'Spaceships',
    pattern: [
      [false, true, false],
      [false, false, true],
      [true, true, true]
    ]
  },
  lwss: {
    name: 'Lightweight Spaceship',
    category: 'Spaceships',
    pattern: [
      [true, true, true, true],
      [true, false, false, true],
      [false, false, false, true],
      [true, false, true, false]
    ]
  },

  // Forme Stabili
  block: {
    name: 'Block',
    category: 'Still Life',
    pattern: [
      [true, true],
      [true, true]
    ]
  },
  beehive: {
    name: 'Beehive',
    category: 'Still Life',
    pattern: [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, true, false]
    ]
  },
  loaf: {
    name: 'Loaf',
    category: 'Still Life',
    pattern: [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, false, true],
      [false, false, true, false]
    ]
  },

  // Pattern Complessi
  pulsar: {
    name: 'Pulsar',
    category: 'Complex',
    pattern: [
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, true, true, true, false, false, false, true, true, true, false, false]
    ]
  },
  pentadecathlon: {
    name: 'Pentadecathlon',
    category: 'Complex',
    pattern: [
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, true, false, false]
    ]
  }
}; 